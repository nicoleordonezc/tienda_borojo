//INSERCIÓN

//1. Insertar un nuevo producto llamado `"Chocolatina de borojó"`, categoría `"Snack"`, con precio `4000`, stock `35`, y tags `["dulce", "energía"]`.

db.productos.insertOne({"nombre": "Chocolatina de borojó",
    "categoria": "Snack",
    "precio": 4000,
    "stock": 35,
    "tags": [
      "dulce",
      "energía"
    ]
  })

//2. Insertar un nuevo cliente que se llama "Mario Mendoza", con correo "mario@email.com", sin compras, y preferencias "energético" y "natural".

  db.clientes.insertOne({ "_id": 11, 
    "nombre": "Mario Mendoza", 
    "email": "mario@email.com", 
    "compras": [], 
    "preferencias": ["natural", "energético"

    ] })

//LECTURA

//1. Consultar todos los productos que tengan stock mayor a 20 unidades.

db.productos.find({stock:{$gt:20}})

//2. Encontrar los clientes que no han comprado aún ningún producto.

db.clientes.find({compras:[]})

//ACTUALIZACIÓN

//1. Aumentar en 10 unidades el stock del producto "Borojó deshidratado".

db.productos.updateOne({nombre:"Borojó deshidratado"},{$inc:{stock:10}})

//2. Añadir el tag "bajo azúcar" a todos los productos de la categoría "Bebida".

db.productos.updateMany({categoria:"Bebida"}, {$push:{tags:"bajo azúcar"}})

//ELIMINACIÓN

//1. Eliminar el cliente que tenga el correo "juan@email.com".

db.clientes.deleteOne({email:"juan@email.com"})

//2. Eliminar todos los productos con stock menor a 5 (considera esto como un proceso de limpieza de inventario).

db.productos.deleteMany({stock:{$lt:5}})

//CONSULTAS CON EXPRESIONES REGULARES

// 1. Buscar productos cuyo nombre **empiece** por `"Boro"`.

db.productos.find({nombre:{$regex:"^Boro"}})

// 2. Encontrar productos cuyo nombre contenga la palabra `"con"` (como en “Concentrado de borojó”).

db.productos.find({nombre:{$regex:"con", $options: "i" }})

// 3. Encontrar clientes cuyo nombre tenga la letra `"z"` (insensible a mayúsculas/minúsculas).

db.clientes.find({nombre:{$regex:"z", $options: "i" }})

//OPERADORES EN CONSULTAS SOBRE ARRAYS

//1. Buscar clientes que tengan `"natural"` en sus preferencias.

db.clientes.find({preferencias:{$in:["natural"]}})

//2. Encontrar productos que tengan al menos los tags `"natural"` y `"orgánico"` (usa `$all`).

db.productos.find({tags:{$all:["natural", "orgánico"]}})

//3. Listar productos que tienen **más de un tag** (`$size`).

db.productos.find({$expr:{$gt:[{$size:"$tags"},1]}})

//AGGREGATION FRAMEWORK CON PIPELINES

//1. Mostrar un listado de los productos más vendidos (suma total de unidades vendidas por producto).

db.ventas.aggregate([{$unwind:"$productos"}, {$group:{_id:"$productos.productoId", totalVentas:{$sum:"$productos.cantidad"}}}, {$sort:{totalVentas:-1}}])

//2. Agrupar clientes por cantidad de compras realizadas.

db.ventas.aggregate([{$project: {_id:0, clienteId:1, totalCompras:{$sum:"$productos.cantidad"}}}])

//3. Mostrar el total de ventas por mes (usa `$group` y `$month`).

db.ventas.aggregate([{$group:{_id:{mes:{$month:"$fecha"}}, totalVentas:{$sum:"$total"}}}])

//4. Calcular el promedio de precios por categoría de producto.

db.productos.aggregate({$group:{_id:"$categoria", promedioPrecios:{$avg:"$precio"}}})

//5. Mostrar los 3 productos con mayor stock (orden descendente con `$sort` y `$limit`).

db.productos.aggregate([{$sort:{stock:-1}},{$limit:3},{$project:{_id:0, nombre:1, stock:1}}])

//FUNCIONES DEFINIDAS EN `system.js`

//1. Definir una función `calcularDescuento(precio, porcentaje)` que devuelva el precio con descuento aplicado.

 db.system.js.insertOne({_id:"descuento", value: new Code("function(precio, porcentaje){return precio - (precio*porcentaje)}")});  
 const descuento = db.system.js.findOne({_id:"descuento"});
 const calcularDescuento = new Function("return " + descuento.value.code)();
 const venta1 = db.ventas.findOne({_id:1});
 calcularDescuento(venta1.total, 0.20)

//2. Definir una función `clienteActivo(idCliente)` que devuelva `true` si el cliente tiene más de 3 compras registradas.

db.system.js.insertOne({_id:"c", value: new Code("function(id){return id.compras.length>3}")});
const cliente = db.system.js.findOne({_id:"c"});
const clienteActivo = new Function("return " + cliente.value.code)();
const idValentina = db.clientes.findOne({nombre:"Valentina Ortiz"});
 clienteActivo(idValentina)

//. Definir una función `verificarStock(productoId, cantidadDeseada)` que retorne si hay suficiente stock.

db.system.js.insertOne({_id:"vs", value: new Code("function(p,c){return c <= p.stock ? 'Hay suficiente stock' : 'No hay suficiente stock';}")});
const vs = db.system.js.findOne({_id:"vs"});
const verificarStock = new Function("return " + vs.value.code)();
const borojoFresco = db.productos.findOne({_id:1});
verificarStock(borojoFresco, 20)