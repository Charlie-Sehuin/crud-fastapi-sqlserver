from fastapi import APIRouter
from config.db import get_connection
from sqlalchemy import text
from schemas.user import Customer as User, UpdateCustomer

user = APIRouter()

@user.get("/users")
def get_users():
    try:
        conn = get_connection()
        rows = conn.execute(text("SELECT CompanyName, ContactName FROM Customers")).fetchall()
        return [dict(row._mapping) for row in rows]
    except Exception as e:
        return {"error": str(e)}
    
@user.get("/users/{user_id}")
def get_user_id(user_id):
    try:
        conn = get_connection()
        row = conn.execute(
            text("SELECT * FROM Customers WHERE CustomerID = :id"),
            {"id": user_id}
        ).fetchone()
        
        if row is None:
            return {"message": "Usuario no encontrado"}
        
        return dict(row._mapping)
    except Exception as e:
        return {"error": str(e)}
    
@user.post("/users")
def create_user(user: User):
    try:
        conn = get_connection()
        conn.execute(
            text("""INSERT INTO Customers 
                    (CustomerID, CompanyName, ContactName, ContactTitle, Address, City, Region, PostalCode, Country, Phone, Fax)
                    VALUES (:CustomerID, :CompanyName, :ContactName, :ContactTitle, :Address, :City, :Region, :PostalCode, :Country, :Phone, :Fax)"""),
            user.model_dump()
        )
        conn.commit()

        return {"message": "Usuario creado", "data": user}
    except Exception as e:
        return {"error": str(e)}

@user.put("/users/{user_id}")
def update_user(user_id: str, user: UpdateCustomer):
    try:
        conn = get_connection()
        
        # Filtrar solo los campos que no son None
        update_data = {k: v for k, v in user.model_dump().items() if v is not None}
        
        if not update_data:
            return {"message": "No hay campos para actualizar"}
        
        # Construir la cláusula SET dinámicamente
        set_columns = [f"{field} = :{field}" for field in update_data.keys()]
        set_clause = ", ".join(set_columns)
        
        # Agregar el ID para la cláusula WHERE
        update_data["id"] = user_id
        
        # Ejecutar la actualización
        query = f"UPDATE Customers SET {set_clause} WHERE CustomerID = :id"
        conn.execute(text(query), update_data)
        conn.commit()
        
        return {"message": "Usuario actualizado"}
    except Exception as e:
        return {"error": str(e)}
    
@user.delete("/users/{user_id}")
def delete_user(user_id):
    try:
        conn = get_connection()
        result = conn.execute(
            text("DELETE FROM Customers WHERE CustomerID = :id"),
            {"id": user_id}
        )
        conn.commit()

        if result.rowcount == 0:
            return {"message": "Usuario no encontrado"}

        return {"message": "Usuario eliminado"}
    except Exception as e:
        return {"error": str(e)}
    


