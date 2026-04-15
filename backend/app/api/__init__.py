from fastapi import APIRouter

api_router = APIRouter()

from . import cards, quiz

api_router.include_router(cards.router, prefix="/cards", tags=["cards"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
