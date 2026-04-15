from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..models import Card, CardCreate, CardUpdate, CardResponse, CardGenerateRequest, Difficulty
from ..services.llm_service import LLMService, GeneratedQA
from ..services.rag_service import RAGService
from datetime import datetime
import uuid

router = APIRouter()

# In-memory storage for demo purposes
# In production, replace with a real database
cards_db: dict[str, Card] = {}

llm_service = LLMService()
rag_service = RAGService()

# Initialize with some sample cards for demo
def _initialize_sample_cards():
    """初始化一些示例卡片用于演示"""
    if not cards_db:  # Only initialize if empty
        now = datetime.now()
        sample_cards = [
            Card(
                id=str(uuid.uuid4()),
                topic="素描中的明暗关系",
                question="什么是明暗五调子？",
                answer="明暗五调子包括亮面、灰面、明暗交界线、反光和投影。这是表现物体立体感和光影效果的基本方法。",
                difficulty=Difficulty.INTERMEDIATE,
                tags=["素描", "明暗"],
                created_at=now,
                updated_at=now
            ),
            Card(
                id=str(uuid.uuid4()),
                topic="色彩理论",
                question="什么是对比色？",
                answer="对比色是指在色轮上位置相对的颜色，如红色和绿色、蓝色和橙色、黄色和紫色。使用对比色可以创造强烈的视觉冲击力。",
                difficulty=Difficulty.INTERMEDIATE,
                tags=["色彩", "配色"],
                created_at=now,
                updated_at=now
            ),
            Card(
                id=str(uuid.uuid4()),
                topic="水彩技法",
                question="什么是水彩的湿画法？",
                answer="湿画法是指在湿润的画纸上进行着色，让色彩自然融合流动，创造出柔和的过渡效果。适合表现天空、水面等需要色彩渐变的主题。",
                difficulty=Difficulty.BEGINNER,
                tags=["水彩", "技法"],
                created_at=now,
                updated_at=now
            ),
            Card(
                id=str(uuid.uuid4()),
                topic="构图原则",
                question="什么是三分法则？",
                answer="三分法则是一种构图技巧，将画面分为九宫格（两横两竖三条线），将主体放在交叉点上，可以创造更和谐、更有吸引力的画面布局。",
                difficulty=Difficulty.BEGINNER,
                tags=["构图", "基础"],
                created_at=now,
                updated_at=now
            ),
            Card(
                id=str(uuid.uuid4()),
                topic="油画技法",
                question='什么是油画的"肥盖瘦"原则？',
                answer="'肥盖瘦'是指先画薄层（瘦），后画厚层（肥）的绘画原则。这样可以确保底层颜料先干燥，上层颜料不会与底层混合，保持色彩的纯净度。",
                difficulty=Difficulty.ADVANCED,
                tags=["油画", "技巧"],
                created_at=now,
                updated_at=now
            ),
        ]

        for card in sample_cards:
            cards_db[card.id] = card

# Initialize sample cards on module load
_initialize_sample_cards()


def get_card_response(card: Card) -> CardResponse:
    """Convert Card to CardResponse"""
    return CardResponse(
        id=card.id,
        topic=card.topic,
        question=card.question,
        answer=card.answer,
        difficulty=card.difficulty,
        tags=card.tags,
        created_at=card.created_at or datetime.now(),
        updated_at=card.updated_at or datetime.now()
    )


@router.get("", response_model=List[CardResponse])
async def get_cards(
    difficulty: Difficulty = None,
    tag: str = None,
    limit: int = 50
):
    """
    获取所有复习卡片
    """
    filtered_cards = list(cards_db.values())

    if difficulty:
        filtered_cards = [c for c in filtered_cards if c.difficulty == difficulty]

    if tag:
        filtered_cards = [c for c in filtered_cards if tag in c.tags]

    return [get_card_response(c) for c in filtered_cards[:limit]]


@router.get("/{card_id}", response_model=CardResponse)
async def get_card(card_id: str):
    """
    获取单个复习卡片
    """
    if card_id not in cards_db:
        raise HTTPException(status_code=404, detail="Card not found")
    return get_card_response(cards_db[card_id])


@router.post("", response_model=CardResponse, status_code=201)
async def create_card(card: CardCreate):
    """
    创建新的复习卡片
    """
    card_id = str(uuid.uuid4())
    now = datetime.now()

    # If question and answer not provided, generate them from topic
    if not card.question or not card.answer:
        generated_qas = await llm_service.generate_qa(
            topic=card.topic,
            difficulty=card.difficulty.value,
            num_questions=1
        )
        if generated_qas:
            qa = generated_qas[0]
            card.question = card.question or qa.question
            card.answer = card.answer or qa.answer
        else:
            raise HTTPException(status_code=500, detail="Failed to generate question and answer")

    new_card = Card(
        id=card_id,
        topic=card.topic,
        question=card.question,
        answer=card.answer,
        difficulty=card.difficulty,
        tags=card.tags,
        created_at=now,
        updated_at=now
    )

    cards_db[card_id] = new_card

    # Add topic to knowledge base for RAG (silently fail if API quota exceeded)
    try:
        rag_service.add_document_to_kb(
            content=f"主题: {card.topic}\n问题: {card.question}\n答案: {card.answer}",
            metadata={"card_id": card_id, "topic": card.topic, "difficulty": card.difficulty.value}
        )
    except Exception as e:
        # Silently ignore embedding errors - card is still created
        pass

    return get_card_response(new_card)


@router.post("/generate", response_model=List[CardResponse])
async def generate_cards(request: CardGenerateRequest):
    """
    基于主题自动生成多个复习卡片
    """
    try:
        generated_qas = await llm_service.generate_qa(
            topic=request.topic,
            difficulty=request.difficulty.value,
            num_questions=request.num_questions
        )
    except Exception as e:
        # Check if it's an OpenAI quota error
        error_msg = str(e)
        if "insufficient_quota" in error_msg or "429" in error_msg:
            raise HTTPException(
                status_code=429,
                detail="OpenAI API配额不足，无法生成问答。请检查API账户余额或升级套餐。"
            )
        raise HTTPException(status_code=500, detail=f"生成失败: {str(e)}")

    if not generated_qas:
        raise HTTPException(status_code=500, detail="Failed to generate questions")

    now = datetime.now()
    created_cards = []

    for qa in generated_qas:
        card_id = str(uuid.uuid4())
        new_card = Card(
            id=card_id,
            topic=request.topic,
            question=qa.question,
            answer=qa.answer,
            difficulty=request.difficulty,
            tags=[request.topic],
            created_at=now,
            updated_at=now
        )
        cards_db[card_id] = new_card

        # Add to knowledge base (silently fail if API quota exceeded)
        try:
            rag_service.add_document_to_kb(
                content=f"主题: {new_card.topic}\n问题: {new_card.question}\n答案: {new_card.answer}",
                metadata={"card_id": card_id, "topic": new_card.topic, "difficulty": new_card.difficulty.value}
            )
        except Exception:
            # Silently ignore embedding errors
            pass

        created_cards.append(get_card_response(new_card))

    return created_cards


@router.put("/{card_id}", response_model=CardResponse)
async def update_card(card_id: str, card_update: CardUpdate):
    """
    更新复习卡片
    """
    if card_id not in cards_db:
        raise HTTPException(status_code=404, detail="Card not found")

    card = cards_db[card_id]

    if card_update.topic is not None:
        card.topic = card_update.topic
    if card_update.question is not None:
        card.question = card_update.question
    if card_update.answer is not None:
        card.answer = card_update.answer
    if card_update.difficulty is not None:
        card.difficulty = card_update.difficulty
    if card_update.tags is not None:
        card.tags = card_update.tags

    card.updated_at = datetime.now()

    return get_card_response(card)


@router.delete("/{card_id}", status_code=204)
async def delete_card(card_id: str):
    """
    删除复习卡片
    """
    if card_id not in cards_db:
        raise HTTPException(status_code=404, detail="Card not found")

    del cards_db[card_id]
    return None
