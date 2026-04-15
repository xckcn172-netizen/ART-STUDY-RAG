from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class Difficulty(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class Card(BaseModel):
    id: Optional[str] = None
    topic: str = Field(..., description="绘画主题")
    question: str = Field(..., description="问题")
    answer: str = Field(..., description="答案")
    difficulty: Difficulty = Field(default=Difficulty.INTERMEDIATE)
    tags: List[str] = Field(default_factory=list, description="标签")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CardCreate(BaseModel):
    topic: str
    question: Optional[str] = None
    answer: Optional[str] = None
    difficulty: Difficulty = Difficulty.INTERMEDIATE
    tags: List[str] = []


class CardUpdate(BaseModel):
    topic: Optional[str] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    tags: Optional[List[str]] = None


class CardResponse(BaseModel):
    id: str
    topic: str
    question: str
    answer: str
    difficulty: Difficulty
    tags: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CardGenerateRequest(BaseModel):
    topic: str = Field(..., description="输入的绘画主题")
    difficulty: Difficulty = Field(default=Difficulty.INTERMEDIATE)
    num_questions: int = Field(default=1, ge=1, le=5, description="生成的问题数量")
