
# 🛍️ Taller MongoDB — La Tienda del Borojó

Este proyecto es una práctica completa sobre el uso de MongoDB en un escenario comercial realista: una tienda que vende productos derivados del borojó. Aquí se aplican operaciones CRUD, consultas avanzadas, funciones personalizadas, transacciones y estrategias de indexación.

---

## 🧾 1. Descripción del Proyecto y Escenario

**La Tienda del Borojó** es una tienda especializada en productos naturales y energéticos. Este taller simula su sistema de gestión de productos, clientes, ventas e inventarios utilizando una base de datos NoSQL en MongoDB. El objetivo es aplicar de forma práctica las principales funciones del motor de base de datos MongoDB.

---

## ⚙️ 2. Instrucciones para Ejecutar los Scripts

1. Asegúrate de tener MongoDB en modo **Replica Set** para ejecutar transacciones.
2. Abre Mongo Shell (`mongosh`) o usa **MongoDB Compass** con acceso a tu base de datos.
3. Carga el archivo de inserciones y funciones desde el shell con:
   ```bash
   load("ruta/del/script.js")
````

4. Ejecuta los comandos del taller uno por uno, o como scripts separados.

---

## 📚 3. Listado de Ejercicios y Temas

## 📦 INSERCIÓN

**1. Insertar un nuevo producto llamado `"Chocolatina de borojó"`...**

```js
db.productos.insertOne({
  "nombre": "Chocolatina de borojó",
  "categoria": "Snack",
  "precio": 4000,
  "stock": 35,
  "tags": ["dulce", "energía"]
})
````

**2. Insertar un nuevo cliente llamado "Mario Mendoza"...**

```js
db.clientes.insertOne({
  "_id": 11,
  "nombre": "Mario Mendoza",
  "email": "mario@email.com",
  "compras": [],
  "preferencias": ["natural", "energético"]
})
```

---

## 🔍 LECTURA

**1. Consultar todos los productos que tengan stock mayor a 20 unidades:**

```js
db.productos.find({stock: {$gt: 20}})
```

**2. Encontrar los clientes que no han comprado ningún producto:**

```js
db.clientes.find({compras: []})
```

---

## 🛠️ ACTUALIZACIÓN

**1. Aumentar en 10 unidades el stock del producto "Borojó deshidratado":**

```js
db.productos.updateOne({nombre: "Borojó deshidratado"}, {$inc: {stock: 10}})
```

**2. Añadir el tag "bajo azúcar" a todos los productos de la categoría "Bebida":**

```js
db.productos.updateMany({categoria: "Bebida"}, {$push: {tags: "bajo azúcar"}})
```

---

## 🗑️ ELIMINACIÓN

**1. Eliminar el cliente con el correo "[juan@email.com](mailto:juan@email.com)":**

```js
db.clientes.deleteOne({email: "juan@email.com"})
```

**2. Eliminar todos los productos con stock menor a 5:**

```js
db.productos.deleteMany({stock: {$lt: 5}})
```

---

## 🔠 EXPRESIONES REGULARES

**1. Buscar productos cuyo nombre empiece por "Boro":**

```js
db.productos.find({nombre: {$regex: "^Boro"}})
```

**2. Encontrar productos cuyo nombre contenga la palabra "con":**

```js
db.productos.find({nombre: {$regex: "con", $options: "i"}})
```

**3. Encontrar clientes cuyo nombre tenga la letra "z":**

```js
db.clientes.find({nombre: {$regex: "z", $options: "i"}})
```

---

## 📚 OPERADORES SOBRE ARRAYS

**1. Buscar clientes que tengan `"natural"` en sus preferencias:**

```js
db.clientes.find({preferencias: {$in: ["natural"]}})
```

**2. Encontrar productos que tengan los tags `"natural"` y `"orgánico"`:**

```js
db.productos.find({tags: {$all: ["natural", "orgánico"]}})
```

**3. Listar productos que tienen más de un tag:**

```js
db.productos.find({$expr: {$gt: [{$size: "$tags"}, 1]}})
```

---

## 📊 AGGREGATION FRAMEWORK

**1. Listado de los productos más vendidos:**

```js
db.ventas.aggregate([
  {$unwind: "$productos"},
  {$group: {
    _id: "$productos.productoId",
    totalVentas: {$sum: "$productos.cantidad"}
  }},
  {$sort: {totalVentas: -1}}
])
```

**2. Agrupar clientes por cantidad de compras realizadas:**

```js
db.ventas.aggregate([
  {$project: {
    _id: 0,
    clienteId: 1,
    totalCompras: {$sum: "$productos.cantidad"}
  }}
])
```

**3. Mostrar el total de ventas por mes:**

```js
db.ventas.aggregate([
  {$group: {
    _id: {mes: {$month: "$fecha"}},
    totalVentas: {$sum: "$total"}
  }}
])
```

**4. Calcular el promedio de precios por categoría:**

```js
db.productos.aggregate([
  {$group: {
    _id: "$categoria",
    promedioPrecios: {$avg: "$precio"}
  }}
])
```

**5. Mostrar los 3 productos con mayor stock:**

```js
db.productos.aggregate([
  {$sort: {stock: -1}},
  {$limit: 3},
  {$project: {_id: 0, nombre: 1, stock: 1}}
])
```

---

## ⚙️ FUNCIONES PERSONALIZADAS EN `system.js`

**1. Función `calcularDescuento(precio, porcentaje)`:**

```js
db.system.js.insertOne({
  _id: "descuento",
  value: new Code("function(precio, porcentaje){ return precio - (precio * porcentaje) }")
})
```

**Uso:**

```js
const descuento = db.system.js.findOne({_id:"descuento"});
const calcularDescuento = new Function("return " + descuento.value.code)();
const venta1 = db.ventas.findOne({_id:1});
calcularDescuento(venta1.total, 0.20)
```

**2. Función `clienteActivo(idCliente)`:**

```js
db.system.js.insertOne({
  _id: "c",
  value: new Code("function(id){ return id.compras.length > 3 }")
})
```

**Uso:**

```js
const cliente = db.system.js.findOne({_id: "c"});
const clienteActivo = new Function("return " + cliente.value.code)();
const idValentina = db.clientes.findOne({nombre: "Valentina Ortiz"});
clienteActivo(idValentina)
```

**3. Función `verificarStock(producto, cantidad)`:**

```js
db.system.js.insertOne({
  _id: "vs",
  value: new Code("function(p,c){ return c <= p.stock ? 'Hay suficiente stock' : 'No hay suficiente stock'; }")
})
```

**Uso:**

```js
const vs = db.system.js.findOne({_id:"vs"});
const verificarStock = new Function("return " + vs.value.code)();
const producto = db.productos.findOne({_id: 1});
verificarStock(producto, 20)
```

---

## 🔄 TRANSACCIONES

**1. Simular una venta (insertar venta y descontar stock):**

```js
const session = db.getMongo().startSession();
const dbSession = session.getDatabase("tienda_borojo");

session.startTransaction();
try {
  dbSession.ventas.insertOne({
    _id: 11,
    clienteId: 11,
    productos: [{productoId: 1, cantidad: 2}],
    fecha: ISODate("2025-06-22"),
    total: 10000
  });
  dbSession.productos.updateOne({_id: 1}, {$inc: {stock: -2}});
  session.commitTransaction();
  print("Venta confirmada");
} catch (error) {
  session.abortTransaction();
  print("Error:", error);
} finally {
  session.endSession();
}
```

**2. Simular entrada de nuevo inventario:**

```js
session.startTransaction();
try {
  dbSession.inventario.insertOne({
    _id: 11,
    productoId: 1,
    lote: "L011",
    cantidad: 80,
    entrada: new Date("2025-06-22")
  });
  dbSession.productos.updateOne({_id: 1}, {$inc: {stock: 80}});
  session.commitTransaction();
  print("Inventario confirmado");
} catch (error) {
  session.abortTransaction();
  print("Error:", error);
} finally {
  session.endSession();
}
```

**3. Realizar una devolución (aumentar stock y eliminar venta):**

```js
session.startTransaction();
try {
  dbSession.ventas.deleteOne({_id: 11});
  dbSession.productos.updateOne({_id: 1}, {$inc: {stock: 2}});
  session.commitTransaction();
  print("Devolución confirmada");
} catch (error) {
  session.abortTransaction();
  print("Error:", error);
} finally {
  session.endSession();
}
```

---

## 🔍 ÍNDICES

**1. Crear índice en `nombre` para búsquedas rápidas:**

```js
db.productos.createIndex({nombre: 1})
db.productos.find({nombre: "Jugo de borojó"})
```

**2. Crear índice compuesto sobre `categoria` y `precio`:**

```js
db.productos.createIndex({categoria: 1, precio: 1})
db.productos.find({categoria: "Fruta", precio: {$lte: 5000}})
```

**3. Crear índice en `email` para evitar duplicados:**

```js
db.clientes.createIndex({email: 1})
db.clientes.find({email: {$regex: "email"}})
```

**4. Verificar uso del índice con `explain()`:**

```js
db.productos.find({nombre: "Jugo de borojó"}).explain("executionStats")
```

---

## ✅ Créditos

**Desarrollado por**

* Estudiante: Nicole Ordoñez
* Docente: Juan Mmariño

---
