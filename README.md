# Wasp

The modern TypeScript local database.

## Quick Start

You need to have [Node.js](http://nodejs.org/) installed.

Next step is install the wasp library:

```bash
npm install wasp --save
```

First of all we need to know how the data will be saved and validated. For it, we need to create our own Schema instance.

```ts
interface Post {
    title: string;
    content: string;
}

const postSchema = new Schema<Post>({
    title: Schema.string(),
    content: Schema.string(),
});
```

Now we have to create the [Model](#model) where the data will be saved.

```ts
const posts = new Model('posts', postSchema);
```

The [Model](#model) class is where the magic happens, where our documents will be saved, created, updated, deleted and found. Each document has all properties declared in the [Schema](#schema) used in the model.

Let's create some post:

```ts
const newPost = post.create({
    title: 'Wasp',
    content: 'Why wasp is so good?',
    id: '123',
});

console.log(newPost.title); // Prints: "Wasp"
```

Each document has an unique ID (identifier), so you can pass your own `id` when creating a new document with `<Model>.create` function.

We need to find our documents that we created before, for it we use the `findById` function.

```ts
const posts = new Model('posts', postSchema);

// Return { "title": "Wasp", "content": "Why wasp is so good?", "id": "123" }
posts.findById('123');
```

Sometimes we need to delete some unused document or a document that we don't want, so we use the `<Model>.findByIdAndDelete` function.

```ts
const posts = new Model('posts', postSchema);

// Return the data and delete the document in the schema
posts.findByIdAndDelete('123');
```

### Congrats

You finnaly know how to create/read/delete data with wasp database!

## Managing the data by yourself

If you want to manage all data by yourself, use `JSONDriver` instead of `createModel`

```ts
import { JSONDriver } from 'wasp';

const driver = new JSONDriver(PATH);

// Updates the data, the `update` function doesn't care with the function return value
driver.update((data) => {
    data['Me'] = { username: 'Unknown' };
});

/**
 * {
 *    "Me": {
 *       "username": "Unknown"
 *    }
 * }
 */
driver.read();
```

## Schema

Schemas are the best way to validate data with the Wasp library.

-   Definition: `new Schema(shape)`

### Types

-   Any (Any value)
-   BigInt
-   Boolean
-   Date
-   Number (not a bigint)
-   String

#### Types Example

```ts
// String
Schema.string();

// BigInt
Schema.bigint();

// Boolean
Schema.boolean();

// Date
Schema.date();

// Number
Schema.number();

// Any
Schema.any();
```

### Example

```ts
interface User {
    username: string;
    age: number;
    birthday?: Date;
}

const userSchema = new Schema<User>({
    username: Schema.string(),
    age: Schema.number().integer(),
    birthday: Schema.date().optional(),
});
const users = createModel('users', userSchema);

// Returns an instance of `Document<User>`
users.create({ username: 'Unknown', age: 5 });
```

## Model

Models are the base for creating, reading, updating and deleting a document and other stuffs.

There are two ways to create a model, using `Model` class, or using `createModel` function.

### Examples

#### Creating a model

```ts
import { Model, createModel } from 'wasp';

const users = new Model('users', userSchema);

const users = createModel('users', userSchema);
```

#### Using a model

```ts
const postSchema = new Schema({
    title: Schema.string(),
    content: Schema.string(),
    createdAt: Schema.date(),
});
const posts = createModel('posts', postSchema);

const { data } = posts.create({
    title: 'Wasp Database',
    content: 'The new modern TypeScript local database!',
    createdAt: new Date(),
});

// Prints: "Wasp Database"
console.log(data.title);
```
