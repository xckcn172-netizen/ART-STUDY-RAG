from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..models import (
    QuizSession, QuizCreate, QuizSubmit, QuizResponse, QuizStats, QuizAnswer
)
from ..api.cards import cards_db, get_card_response
from datetime import datetime
import uuid

router = APIRouter()

# In-memory storage for quiz sessions
quiz_sessions_db: dict[str, QuizSession] = {}

# Statistics storage
quiz_stats_db = {
    "total_quizzes": 0,
    "total_score": 0,
    "completed_quizzes": [],
}


def calculate_similarity(answer1: str, answer2: str) -> float:
    """
    简单的相似度计算
    在生产环境中可以使用更复杂的NLP方法
    """
    # 简单的基于关键词重合度的计算
    words1 = set(answer1.lower().split())
    words2 = set(answer2.lower().split())

    if not words1 or not words2:
        return 0.0

    intersection = words1.intersection(words2)
    union = words1.union(words2)

    return len(intersection) / len(union)


@router.post("", response_model=QuizResponse)
async def create_quiz(quiz: QuizCreate):
    """
    创建新的测验会话
    """
    # Get cards
    available_cards = list(cards_db.values())

    if not available_cards:
        raise HTTPException(status_code=400, detail="No cards available for quiz")

    # Select cards
    if quiz.card_ids:
        selected_ids = [cid for cid in quiz.card_ids if cid in cards_db]
        if not selected_ids:
            raise HTTPException(status_code=404, detail="Some cards not found")
    else:
        # Random selection
        import random
        num_cards = min(quiz.num_cards, len(available_cards))
        selected_cards = random.sample(available_cards, num_cards)
        selected_ids = [c.id for c in selected_cards]

    quiz_id = str(uuid.uuid4())
    now = datetime.now()

    quiz_session = QuizSession(
        id=quiz_id,
        card_ids=selected_ids,
        answers=[],
        score=None,
        started_at=now,
        completed_at=None
    )

    quiz_sessions_db[quiz_id] = quiz_session

    return QuizResponse(
        id=quiz_session.id,
        card_ids=quiz_session.card_ids,
        answers=quiz_session.answers,
        score=quiz_session.score,
        started_at=quiz_session.started_at,
        completed_at=quiz_session.completed_at
    )


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(quiz_id: str):
    """
    获取测验会话
    """
    if quiz_id not in quiz_sessions_db:
        raise HTTPException(status_code=404, detail="Quiz not found")

    session = quiz_sessions_db[quiz_id]
    return QuizResponse(
        id=session.id,
        card_ids=session.card_ids,
        answers=session.answers,
        score=session.score,
        started_at=session.started_at,
        completed_at=session.completed_at
    )


@router.post("/submit", response_model=QuizResponse)
async def submit_quiz(submission: QuizSubmit):
    """
    提交测验答案
    """
    if submission.session_id not in quiz_sessions_db:
        raise HTTPException(status_code=404, detail="Quiz not found")

    session = quiz_sessions_db[submission.session_id]

    # Check if already submitted
    if session.completed_at:
        raise HTTPException(status_code=400, detail="Quiz already submitted")

    # Check answers
    total_score = 0.0
    graded_answers = []

    for user_answer in submission.answers:
        if user_answer.card_id not in cards_db:
            continue

        card = cards_db[user_answer.card_id]

        # Calculate similarity score
        similarity = calculate_similarity(user_answer.user_answer, card.answer)
        score = similarity * 100
        is_correct = similarity > 0.6  # 60% similarity threshold

        graded_answer = QuizAnswer(
            card_id=user_answer.card_id,
            user_answer=user_answer.user_answer,
            is_correct=is_correct,
            score=score
        )
        graded_answers.append(graded_answer)
        total_score += score

    # Calculate average score
    if graded_answers:
        session.score = total_score / len(graded_answers)
    else:
        session.score = 0.0

    session.answers = graded_answers
    session.completed_at = datetime.now()

    # Update stats
    quiz_stats_db["total_quizzes"] += 1
    quiz_stats_db["total_score"] += session.score
    quiz_stats_db["completed_quizzes"].append(session.score)

    return QuizResponse(
        id=session.id,
        card_ids=session.card_ids,
        answers=session.answers,
        score=session.score,
        started_at=session.started_at,
        completed_at=session.completed_at
    )


@router.get("/stats/overview", response_model=QuizStats)
async def get_quiz_stats():
    """
    获取测验统计数据
    """
    total_quizzes = quiz_stats_db["total_quizzes"]
    total_score = quiz_stats_db["total_score"]
    completed_quizzes = quiz_stats_db["completed_quizzes"]

    average_score = total_score / total_quizzes if total_quizzes > 0 else 0.0

    # Get recent performance (last 10 quizzes)
    recent_performance = completed_quizzes[-10:] if completed_quizzes else []

    return QuizStats(
        total_quizzes=total_quizzes,
        average_score=round(average_score, 2),
        total_cards_learned=len(cards_db),
        recent_performance=[round(s, 2) for s in recent_performance]
    )


@router.delete("/{quiz_id}", status_code=204)
async def delete_quiz(quiz_id: str):
    """
    删除测验会话
    """
    if quiz_id not in quiz_sessions_db:
        raise HTTPException(status_code=404, detail="Quiz not found")

    del quiz_sessions_db[quiz_id]
    return None
