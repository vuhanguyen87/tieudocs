import { computed } from 'vue'
import { imgURL } from '../composable/multiSizeImgs.js'

export const Gallery = {
    setup(props){
        return { imgURL }
    },
    template: `
    <section class="text-center">
        <h1 class="text-2xl font-bold">Gallery</h1>
        <div class="mt-4 md:mt-8 mx-4 md:mx-0 flex space-x-6">
            
        </div>
    </section>`
}