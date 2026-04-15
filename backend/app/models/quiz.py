from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class QuizAnswer(BaseModel):
    card_id: str
    user_answer: str
    is_correct: Optional[bool] = None
    score: Optional[float] = None


class QuizSession(BaseModel):
    id: Optional[str] = None
    card_ids: List[str] = Field(..., description="测验包含的卡片ID列表")
    answers: List[QuizAnswer] = Field(default_factory=list)
    score: Optional[float] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class QuizCreate(BaseModel):
    card_ids: Optional[List[str]] = None
    num_cards: Optional[int] = Field(default=5, ge=1, le=20, description="随机选取的卡片数量")


class QuizSubmit(BaseModel):
    session_id: str
    answers: List[QuizAnswer]


class QuizResponse(BaseModel):
    id: str
    card_ids: List[str]
    answers: List[QuizAnswer]
    score: Optional[float]
    started_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class QuizStats(BaseModel):
    total_quizzes: int
    average_score: float
    total_cards_learned: int
    recent_performance: List[float]
