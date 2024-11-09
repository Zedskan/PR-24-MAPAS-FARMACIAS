import pandas as pd
import mysql.connector

# Cargar el archivo CSV
excel_data = pd.read_csv('C:/Users/DANIEL/Downloads/uwu.csv', delimiter=';')

# Conexión a la base de datos MySQL
conexion = mysql.connector.connect(
    host='127.0.0.1',
    user='root',
    password='UNIVALLE',
    database='pharmacymaps'
)
cursor = conexion.cursor()

print(excel_data.head())  # Muestra las primeras filas del DataFrame

# Verificar y limpiar datos
excel_data = excel_data.fillna('')  # O df = df.fillna('')

# Insertar datos en la tabla ownerpharmacy
owners_inserted = {}
for _, row in excel_data.iterrows():
    if row['PROPIETARIO'] not in owners_inserted:
        cursor.execute(
            """
            INSERT INTO ownerpharmacy (OwnerName, NIT)
            VALUES (%s, %s)
            """, 
            (row['PROPIETARIO'], row['NIT'])
        )
        owners_inserted[row['PROPIETARIO']] = cursor.lastrowid

conexion.commit()

# Insertar datos en la tabla pharmacy
for _, row in excel_data.iterrows():
    owner_id = owners_inserted[row['PROPIETARIO']]
    cursor.execute(
        """
        INSERT INTO pharmacy (
            pharmacyName, sector, typePharmacy, address, zone, latitude, longitude,
             municipality, health_network, openingTime, closingTime, referenceNumber, Idowner
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            row['ESTABLECIMIENTO FARMACEUTICO'], row['SECTOR'], row['TIPO'], row['DIRECCION'],
            row['ZONA'], row['LATITUD'], row['LONGITUD'], 
            row['MUNICIPIO'], row['RED DE SALUD'], '08:00:00', '20:00:00',  # Puedes ajustar los horarios según lo necesario
            row['NUMERO DE REFERENCIA'], owner_id
        )
    )
    pharmacy_id = cursor.lastrowid

    # Insertar datos en la tabla controlledmedications
    if pd.notna(row['MEDICAMENTOS CONTROLADOS']):  # Verifica si hay un valor en la columna de medicamentos controlados
        cursor.execute(
            """
            INSERT INTO controlledmedications (TypeMedicine, Idpharmacy)
            VALUES (%s, %s)
            """,
            (row['MEDICAMENTOS CONTROLADOS'], pharmacy_id)
        )

conexion.commit()
conexion.close()

print("Datos importados correctamente.")
