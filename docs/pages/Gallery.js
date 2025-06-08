import { ref, onMounted, nextTick } from 'vue'
import { imgURL } from '../composable/multiSizeImgs.js'

export const Gallery = {
    setup(props){
        const galleryPhotos = ref([])
        const displayedPhotos = ref([])
        const masonryContainer = ref(null)
        const photosPerPage = 15
        const currentPage = ref(0)
        const loading = ref(false)

        function setGalleryPhotos(data){
            console.log(data.photos)
            // Shuffle all photos but don't slice
            galleryPhotos.value = [...data.photos].sort(() => Math.random() - 0.5)
            console.log(`Total photos available: ${galleryPhotos.value.length}`)
            
            // Load first set of photos
            loadNextPhotos()
        }

        function loadNextPhotos() {
            const startIndex = currentPage.value * photosPerPage
            const endIndex = startIndex + photosPerPage
            const nextPhotos = galleryPhotos.value.slice(startIndex, endIndex)
            
            if (nextPhotos.length > 0) {
                displayedPhotos.value = [...displayedPhotos.value, ...nextPhotos]
                currentPage.value++
                console.log(`Loaded ${nextPhotos.length} more photos. Total displaying: ${displayedPhotos.value.length}`)
                
                // Rearrange masonry after new photos are added
                setTimeout(() => arrangeMasonry(), 500)
            }
        }

        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            
            // Check if user scrolled to bottom (with 100px threshold)
            if (scrollTop + windowHeight >= documentHeight - 100) {
                const hasMorePhotos = currentPage.value * photosPerPage < galleryPhotos.value.length
                if (hasMorePhotos) {
                    loadNextPhotos()
                }
            }
        }

        async function fetchGalleryPhotos(){
            try {
                const res = await fetch('data/gallery.json')
                const data = await res.json()
                setGalleryPhotos(data)
                // Wait for images to load then arrange masonry
                await nextTick()
                setTimeout(() => arrangeMasonry(), 100)
            } catch (error) {
                console.error('Error fetching gallery images:', error)
            }
        }

        function getColumnCount() {
            const width = window.innerWidth
            if (width <= 400) return 1
            if (width <= 700) return 2
            if (width <= 1000) return 3
            return 4
        }

        function arrangeMasonry() {
            if (!masonryContainer.value) return
            
            const container = masonryContainer.value
            const items = container.querySelectorAll('.masonry-item')
            const columnCount = getColumnCount()
            const gap = window.innerWidth <= 700 ? 12 : 16
            
            // Reset container
            container.style.position = 'relative'
            
            // Create column height trackers
            const columnHeights = new Array(columnCount).fill(0)
            
            items.forEach((item, index) => {
                // Find shortest column
                const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
                
                // Position item
                const columnWidth = (container.offsetWidth - (gap * (columnCount - 1))) / columnCount
                const x = shortestColumnIndex * (columnWidth + gap)
                const y = columnHeights[shortestColumnIndex]
                
                item.style.position = 'absolute'
                item.style.left = x + 'px'
                item.style.top = y + 'px'
                item.style.width = columnWidth + 'px'
                
                // Update column height
                columnHeights[shortestColumnIndex] += item.offsetHeight + gap
            })
            
            // Set container height
            container.style.height = Math.max(...columnHeights) + 'px'

            loading.value = false
        }

        function handleResize() {
            arrangeMasonry()
        }

        onMounted(() => {
            fetchGalleryPhotos()
            window.addEventListener('resize', handleResize)
            window.addEventListener('scroll', handleScroll)
        })

        return { 
            displayedPhotos, 
            imgURL, 
            masonryContainer,
            arrangeMasonry
        }
    },
    template: `
    <section class="text-center">
        <h1 class="text-2xl font-bold">Gallery</h1>
        <div class="mt-4 md:mt-8 mx-4 md:mx-0">
            <div 
                ref="masonryContainer"
                class="masonry-container relative"
                style="width: 100%;"
            >
                <div 
                    v-for="(photo, index) in displayedPhotos" 
                    :key="index"
                    class="masonry-item"
                >
                    <img 
                        :src="photo" 
                        :alt="'Gallery image ' + (index + 1)"
                        class="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        loading="lazy"
                        @load="arrangeMasonry"
                        v-show="!loading"
                    />
                </div>
            </div>

            <div v-if="loading" class="flex justify-center items-center py-8">
                <div class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span class="text-lg text-gray-600">Loading...</span>
                </div>
            </div>
        </div>
    </section>`
}