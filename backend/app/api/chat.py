from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import SupportMessage, User
from app.schemas.schemas import SupportMessageCreate, SupportMessageResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat Support"])

@router.post("/send", response_model=SupportMessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    msg_in: SupportMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_msg = SupportMessage(
        user_id=current_user.id,
        sender_name=current_user.username,
        message=msg_in.message,
        is_from_admin=False
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg

@router.get("/messages", response_model=List[SupportMessageResponse])
def get_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(SupportMessage).filter(SupportMessage.user_id == current_user.id).order_by(SupportMessage.created_at).all()

@router.post("/bot-reply", response_model=SupportMessageResponse, status_code=status.HTTP_201_CREATED)
def trigger_bot_reply(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Simulated bot reply
    new_msg = SupportMessage(
        user_id=current_user.id,
        sender_name="Uzum Bot",
        message="Salom! Sizning xabaringiz qabul qilindi. Tez orada operatorlarimiz siz bilan bog'lanishadi.",
        is_from_admin=True,
        is_bot_reply=True
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg
