<template>
    <div class="remove-all btn" @click="newList()">Пересоздать список продуктов</div>
    <div class="level mt-10">

        <div v-if="!createProduct && isPosted">
            <div class="btn ml-10 enter" @click="createProduct = true; onItemCreate()">Создать новый продукт</div>
        </div>

        <div v-else>
            <div v-if="createProduct" class="level mt-10"  @keypress.enter="createProduct = false; putToProducts()">
                <div>Название товара</div>
                <input type="text" class="input ml-10" v-model="newProductData.title">
                <div>Цена</div>
                <input type="number" max="100000000" class="input ml-10" v-model="newProductData.price">
                <div>Фотография</div>
                <input type="file" class="input" @change="onFileChange">
            </div>
            <div v-if="createProduct" class="btn level mt-10 enter" @click="createProduct = false; putToProducts()">Добавить продукт</div>
        </div>

    </div>

    <ol class="cards">
        <li v-for="product in actualItems" :key="product.id">
            <div class="card ml-10">
                <div class="card__top">
                    <a class="card__image">
                        <img :src="product.image" :alt="product.description" />
                    </a>
                </div>

                <div class="card__bottom">
                    <div class="card__prices">
                        <div class="card__price">{{ product.price }}</div>
                    </div>
                    <a class="card__title">
                        {{ product.title }}
                    </a>
                    <button class="card__add" @click="moveToDone(product.id)">Вычеркнуть</button>
                </div>
            </div>
        </li>
    </ol>
    <div class="level mt-20" v-if="doneItems.length !== 0">Удалённые товары: </div>
    <ul class="done-items mt-10 cards">
        <li v-for="product in doneItems" :key="product.id">
            <div class="card">
                <div class="card__top">
                    <a class="card__image">
                        <img :src="product.image" :alt="product.description" />
                    </a>
                </div>

                <div class="card__bottom">
                    <div class="card__prices">
                        <div class="card__price">{{ product.price }}</div>
                    </div>
                    <a class="card__title">
                        {{ product.title }}
                    </a>


                    <button class="card__add" @click="moveToActual(product.id)">Вернуть</button>
                </div>
            </div>


        </li>

    </ul>
    <div class="mt-10">
        <div class="btn remove-done" @click="deleteDone()">Удалить выбранные продукты</div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
import axios from 'axios'
const url = "https://fakestoreapi.com/products"
const urlImg = "https://api.imgbb.com/1/upload?expiration=600&key=14f6235824cddc89097e932ab0a79c23%20"


const actualItems = ref([])
const doneItems = ref([])
const newProductData = ref(null)

const createProduct = ref(false)
const isPosted = ref(true)



onMounted(async () => {
    if (!localStorage.getItem("hasProducts")) {
        getProducts()
    } else {
        if (localStorage.getItem("actualProducts")) {
            //console.log(localStorage.getItem("actualProducts"))
            actualItems.value.push(...JSON.parse(localStorage.getItem("actualProducts")))
        }
        if (localStorage.getItem("doneProducts")) {
            doneItems.value.push(...JSON.parse(localStorage.getItem("doneProducts")))
        }
    }


})

onUpdated(() => {

    localStorage.setItem("actualProducts", JSON.stringify(actualItems.value))
    localStorage.setItem("doneProducts", JSON.stringify(doneItems.value))

    localStorage.setItem("hasProducts", true)
})


const onItemCreate = () => {

    newProductData.value = {
        id: getlastId(),
        title: '',
        price: null,
        image: null,
    }
    console.log(newProductData.value.id)

}


const moveToDone = (id) => {
    const idx = actualItems.value.findIndex(item => item.id === id)
    const [item] = actualItems.value.splice(idx, 1)
    doneItems.value.push(item)
}

const moveToActual = (id) => {

    const idx = doneItems.value.findIndex(item => item.id === id)

    const [item] = doneItems.value.splice(idx, 1)
    actualItems.value.push(item)
}

const newList = () => {
    actualItems.value = []
    doneItems.value = []
    getProducts()
}

const deleteDone = () => {
    doneItems.value = []
}

const onFileChange = async (e) => {
    newProductData.value.image = e.target.files[0]
}

const putToProducts = async () => {
    
    if (!(newProductData.value.image && newProductData.value.price && newProductData.value.title)) {
        alert("Данные заполнены неверно")
        return
    }
    isPosted.value = false

    const fd = new FormData()
    fd.append('image', newProductData.value.image)

    try {

        const resp = await axios.post(urlImg, fd)

        if (resp.data.data.medium !== undefined) {
            newProductData.value.image = resp.data.data.medium.url
        } else {
            newProductData.value.image = resp.data.data.image.url
        }
        actualItems.value.push(newProductData.value)

    } catch (error) {
        alert(error)
    }
    isPosted.value = true

}

const getProducts = async () => {
    localStorage.clear()
    try {
        const resp = await axios.get(`${url}?limit=5`)
        actualItems.value.push(...resp.data)

    } catch (error) {

        alert(error)
    }

}


const getlastId = () => {

    return doneItems.value.length + actualItems.value.length + 1
}
</script>
  