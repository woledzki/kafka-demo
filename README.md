# Simple Kafak Demo

First `npm install` and then

terminal one:

```BASH
export DEMO_HOST=0.0.0.0
export DEMO_ZOOKEEPER_CS=zookeeper-1.io.int:2181,zookeeper-2.io.int:2181,zookeeper-3.io.int:2181
node producer
```

terminal two

```BASH
export DEMO_HOST=0.0.0.0
export DEMO_ZOOKEEPER_CS=zookeeper-1.io.int:2181,zookeeper-2.io.int:2181,zookeeper-3.io.int:2181
node store
```

The `producer` app will create new topic called "click", and everytime
you click the button on the `http://localhost:8001/` it will send send
a Kafka message.

The `store` app listens on "click" topic, and adds all messages from
each button and displays it on a pie chart at `localhost:8002/`.
