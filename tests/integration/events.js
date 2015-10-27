var simple = require('simple-mock')
var test = require('tape')

var MockStore = require('../utils/mock-store')
var TaskQueue = require('../../index')

test('Events: typedQueue.on', function (t) {
  t.plan(3)

  simple.mock(TaskQueue.internals, 'CustomStore').callFn(function (id) {
    return new MockStore(id)
  })

  var taskQueue = new TaskQueue('id123')
  var fooQueue = taskQueue('foo')
  var events = []

  fooQueue.on('start', function (task) {
    events.push(task)
  })

  fooQueue.start({
    property: 'value'
  })

  setTimeout(function () {
    t.is(typeof fooQueue.on, 'function', 'has "on" method')
    t.is(events.length, 1, 'emits one "start" event')
    t.is(events[0].attributes.property, 'value', 'emits correct task')
    simple.restore()
  }, 500)
})

test('Events: typedQueue.one', function (t) {
  t.plan(3)

  simple.mock(TaskQueue.internals, 'CustomStore').callFn(function (id) {
    return new MockStore(id)
  })

  var taskQueue = new TaskQueue('id123')
  var fooQueue = taskQueue('foo')
  var events = []

  fooQueue.one('start', function (task) {
    events.push(task)
  })

  fooQueue.start({
    property: 'value'
  })

  fooQueue.start({
    property: 'another value'
  })

  setTimeout(function () {
    t.is(typeof fooQueue.one, 'function', 'has "one" method')
    t.is(events.length, 1, 'emits one "start" event')
    t.is(events[0].attributes.property, 'value', 'emits correct task')
    simple.restore()
  }, 500)
})
