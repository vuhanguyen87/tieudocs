import { ref, onMounted } from 'vue'
import { imgURL } from '../composable/multiSizeImgs.js'

export const Gallery = {
    setup(props){
        const galleryPhotos = ref([])

        function setGalleryPhotos(data){
            console.log(data.photos)
            galleryPhotos.value = data.photos[0].sort(() => Math.random() - 0.5)
            console.log(galleryPhotos.value)
        }

        async function fetchGalleryPhotos(){
            try {
                const res = await fetch('data/gallery.json')
                const data = await res.json()
                setGalleryPhotos(data)
            } catch (error) {
                console.error('Error fetching gallery images:', error)
            }
        }

        onMounted(() => {
            fetchGalleryPhotos()
        })        

        return { galleryPhotos, imgURL }
    },
    template: `
    <section class="text-center">
        <h1 class="text-2xl font-bold">Gallery</h1>
        <div class="mt-4 md:mt-8 mx-4 md:mx-0 flex space-x-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900 z-10">
                                                        <div class="grid gap-4">
                    <div v-for="i in 4" :key="i">
                        <img class="max-w-full rounded-lg" :src="galleryPhotos[0]" alt="" :style="{ height: (i === 1 ? 25 : i === 2 ? 30 : i === 3 ? 20 : 25) + '%' }">
                    </div>
                </div>
                <div class="grid gap-4">
                    <div v-for="i in 4" :key="i">
                        <img class="max-w-full rounded-lg" :src="galleryPhotos[1]" alt="" :style="{ height: (i === 1 ? 25 : i === 2 ? 30 : i === 3 ? 20 : 25) + '%' }">
                    </div>
                </div>
            </div>
        </div>
    </section>`
}