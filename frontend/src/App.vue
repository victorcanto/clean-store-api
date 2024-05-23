<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue';
import Order from './domain/entities/order'
import Product from './domain/entities/product'
import CheckoutGateway from './infra/gateway/checkout-gateway'

const products = reactive([
    new Product(1, "A", 1000),
    new Product(2, "B", 5000),
    new Product(3, "C", 30),
])

const order = reactive(new Order("454.508.362-52"))

const message = ref("")


const getProductById = (idProduct: number): any => {
    return products.find((product: any) => product.idProduct === idProduct)
}

const checkoutGateway = inject("checkoutGateway") as CheckoutGateway

const formatMoney = (value: number) => {
    return value.toLocaleString('us-IN', { style: 'currency', currency: 'USD' })
}

const confirm = async (order: any) => {
    const orderData = await checkoutGateway.checkout(order)
    order.code = orderData.code
    order.total = orderData.total
    message.value = "Success"
}

onMounted(async () => {
    const productsData = await checkoutGateway.getProducts()
    products.push(...productsData)
})

</script>

<template>
    <h1 class="title">Checkout</h1>
    <div v-for="product in products" :key="product.idProduct">
        <span class="product-description">{{ product.description }}</span>
        <span class="product-price">{{ formatMoney(product.price) }}</span>
        <button class="product-add-button" @click="order.addItem(product)">Add</button>
    </div>
    <div class="total">{{ formatMoney(order.getTotal()) }}</div>
    <div v-for="item in order.items" :key="item.id">
        <span class="item-description">{{ getProductById(item.idProduct).description }}</span>
        <span class="item-quantity">{{ item.quantity }}</span>
        <button class="item-increase-button" @click="order.increaseItem(item.idProduct)">+</button>
        <button class="item-decrease-button" @click="order.decreaseItem(item.idProduct)">-</button>
    </div>
    <button class="confirm" @click="confirm(order)">Confirm</button>
    <div class="message">{{ message }}</div>
    <div class="order-code">{{ order.code }}</div>
    <div class="order-total">{{ formatMoney(order.total) }}</div>
</template>

<style scoped></style>
