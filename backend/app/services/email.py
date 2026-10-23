import logging
import os
import smtplib
from email.message import EmailMessage

logger = logging.getLogger(__name__)


def enviar_email_redefinicao(destinatario: str, link: str) -> None:
    host = os.getenv("SMTP_HOST")
    if not host:
        # Modo desenvolvimento: sem SMTP, só registra o link no log
        logger.warning(
            "SMTP não configurado. Link de redefinição para %s: %s",
            destinatario,
            link,
        )
        return

    porta = int(os.getenv("SMTP_PORT", "587"))
    usuario = os.getenv("SMTP_USER")
    senha = os.getenv("SMTP_PASSWORD")
    remetente = os.getenv("EMAIL_REMETENTE", usuario)

    msg = EmailMessage()
    msg["Subject"] = "NATSA - Redefinição de senha"
    msg["From"] = remetente
    msg["To"] = destinatario
    msg.set_content(
        "Recebemos um pedido para redefinir a senha da sua conta no NATSA.\n\n"
        f"Para criar uma nova senha, acesse o link abaixo (válido por 30 minutos):\n{link}\n\n"
        "Se você não fez esse pedido, ignore este e-mail."
    )

    try:
        with smtplib.SMTP(host, porta, timeout=10) as smtp:
            smtp.starttls()
            if usuario and senha:
                smtp.login(usuario, senha)
            smtp.send_message(msg)
    except Exception:
        logger.exception("Falha ao enviar e-mail de redefinição")