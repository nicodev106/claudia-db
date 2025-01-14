 Claudia DB

`claudia-db` es una librería de Node.js que facilita la interacción con bases de datos populares como SQLite, MySQL, MariaDB y PostgreSQL. Permite crear tablas, insertar, obtener y eliminar datos de manera sencilla, usando una API unificada.

## Instalación

Puedes instalar `claudia-db` a través de npm:

```bash
npm install claudia-db
```

## Uso

### 1. Conectar a la base de datos

Para empezar, crea una instancia de la clase `Table` y conecta a la base de datos que deseas usar. Por ejemplo, para SQLite:

```javascript
import sqlite3 from 'sqlite3';
import Table from 'claudia-db';

const db = new sqlite3.Database(':memory:');
const table = new Table('sqlite', db);
```

### 2. Crear una nueva tabla

Para crear una nueva tabla, utiliza el método `new()`. Aquí tienes un ejemplo para crear una tabla `products` con columnas `id`, `name` y `price`:

```javascript
const columns = {
    id: { type: 'INTEGER', isPrimaryKey: true, isAutoIncrement: true },
    name: { type: 'TEXT' },
    price: { type: 'DECIMAL' }
};

await table.new({
    name: 'products',
    columns: columns
});
```

### 3. Obtener datos de una tabla

Para obtener datos de la tabla, usa el método `get()` y proporciona un conjunto de opciones como `where`, `order`, `limit`, etc.:

```javascript
const products = await table.get('products', {
    where: { name: 'Product A' },
    order: { column: 'price', direction: 'ASC' },
    limit: 10
});
```

### 4. Eliminar datos de una tabla

Para eliminar datos de una tabla, usa el método `deleteData()`:

```javascript
await table.deleteData('products', { id: 1 });
```
