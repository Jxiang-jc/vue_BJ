## Proxy
<hr/>

#### 为什么要取代 `Object.defineProperty`

既然要取代 `Object.defineProperty`, 那么它肯定是有一些明显的缺点, 总结起来大概是以下两点

> 1. 在 `Vue` 中, `Object.defineProperty` 在检测数组变化时, 考虑到性能问题, 只对下面7中做了响应式处理
```js
  push()
  pop()
  shift()
  unshift()
  splice()
  sort()
  reverse()
```
- 由于只针对以上八种方法进行了 `hack` 处理, 所以其他数组的属性也时检测不到的, 还是具有一定的局限性

> 2. `Object.defineProperty` 只节能劫持`对象的属性`, 因此我们需要对每个对象的每个属性进行遍历. `Vue`里, 是通过递归以及遍历 `data` 对象来实现对数据的监控的, 如果属性值也是对象那么需要深度遍历, 显然如果能劫持一个完整的对象, 不管是对操作性还是性能都会有一个很大的提升

## 使用`Proxy` 有下面两个优点

> 1. 可以劫持整个对象， 并