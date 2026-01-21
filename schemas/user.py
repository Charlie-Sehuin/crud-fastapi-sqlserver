from pydantic import BaseModel, Field
from typing import Optional

class Customer(BaseModel):
    CustomerID: str
    CompanyName: str
    ContactName: Optional[str] = None
    ContactTitle: Optional[str] = None
    Address: Optional[str] = None
    City: Optional[str] = None
    Region: Optional[str] = None
    PostalCode: Optional[str] = None
    Country: Optional[str] = None
    Phone: Optional[str] = None
    Fax: Optional[str] = None

class UpdateCustomer(BaseModel):
    CompanyName: Optional[str] = None
    ContactName: Optional[str] = None
    ContactTitle: Optional[str] = None
    Address: Optional[str] = None
    City: Optional[str] = None
    Region: Optional[str] = None
    PostalCode: Optional[str] = None
    Country: Optional[str] = None
    Phone: Optional[str] = None
    Fax: Optional[str] = None