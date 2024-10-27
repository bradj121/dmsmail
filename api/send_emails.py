import os

import smtplib

import mimetypes

from email.message import EmailMessage

from . import schemas, crud

# TODO: remove, added for testing
from .database import engine
from sqlalchemy.orm import Session


def send_policy_email(sender: schemas.User, policy: schemas.Policy ):
    smtp_host = os.getenv('SMTP_HOST', 'localhost')
    smtp_port = int(os.getenv('SMTP_PORT', '8025'))

    msg = EmailMessage()

    msg['Subject'] = policy.subject
    msg['From'] = sender.email
    msg['To'] = ', '.join(policy.recipients.split(' '))

    msg.set_content(policy.body)

    attachments_dir = f"files/{sender.id}/{policy.id}"

    attachment_names = policy.attachments.split(',')

    for attachment in attachment_names:
        path = os.path.join(attachments_dir, attachment)
        if not os.path.isfile(path):
            continue
        ctype, encoding = mimetypes.guess_type(path)
        if ctype is None or encoding is not None:
            ctype = 'application/octet-stream'

        maintype, subtype = ctype.split('/', 1)
        with open(path, 'rb') as f:
            msg.add_attachment(f.read(),
                                maintype=maintype, 
                                subtype=subtype, 
                                filename=attachment
                                )
    
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.login(sender.email, sender.smtp_pw)  # TODO: add as attribute
        server.send_message(msg)

