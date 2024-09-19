from typing import List, Optional, Any

from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()


class DmsMailConfig(BaseModel):
    recipients: List[str]
    subject: str
    body: str
    expiration_date: int
    attachments: Optional[List[Any]]  # TODO: this is likely a file or files (e.g. pics/docs)
    dmsmail_id: Optional[str]  



@app.get("/")
def root():
    return {"Welcome": "Home"}


@app.put("/create-dmsmail")
async def create_dmsmail(dmsmail_config: DmsMailConfig):
    return


@app.get("/get-dmsmail/{dmsmail_id}")
async def get_dmsmail(dmsmail_id: str):
    pass


@app.delete("/delete-dmsmail/{dmsmail_id}")
async def delete_dmsmail(dmsmail_id: str):
    pass


@app.put("/update-dmsmail")
async def update_dmsmail(dmsmail_config: DmsMailConfig):
    pass


