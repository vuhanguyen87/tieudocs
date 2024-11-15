import { ref, computed, toRefs, onUnmounted } from 'vue';

export const ProjectCard = {
    props: {
        project: { default: {} },
    },
    setup(props){

        // Replace toRefs with computed to maintain reactivity
        const images = computed(() => props.project.images || []);

        const currentSliderIndex = ref(0);
        
        let intervalId;

        const isTimerPaused = ref(false);

        const nextSlide = () => {
            currentSliderIndex.value = (currentSliderIndex.value + 1) % images.length;
            isTimerPaused ? '' : startSlider()
        };

        const prevSlide = () => {
            currentSliderIndex.value = (currentSliderIndex.value - 1 + images.length) % images.length;
            isTimerPaused ? '' : startSlider()
        };

        const startSlider = () => {
            if (! intervalId) {
                currentSliderIndex.value = 1
                intervalId = setInterval(() => {
                    nextSlide();
                }, 2000);
            }
        };

        const playSlider = () => {
            isTimerPaused.value = false;
            startSlider();
        }

        const stopSlider = () => {
            clearInterval(intervalId);
            intervalId = null
            currentSliderIndex.value = 0
            isTimerPaused.value = true;
        }

        // startSlider();

        const projectPageUrl = computed(() => {
            return '#/project/' + props.project.title
        })

        onUnmounted(() => {
            clearInterval(intervalId);
        })
        
        return { 
            images,
            projectPageUrl,
            nextSlide, prevSlide, isTimerPaused, stopSlider, playSlider, startSlider, currentSliderIndex }
    },
    template: `
    <a 
        class="group"
        :href="projectPageUrl"
        @mouseover="startSlider"
        @mouseleave="stopSlider"
        >
        <div class="relative w-full" style="padding-bottom: 56.25%;">
            <div class="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 duration-500">
                <svg
                    class="size-10 text-gray-200" 
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                    >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
            </div>
            <template v-for="(image, index) in images" :key="index">
                <transition
                    enter-from-class="opacity-0"
                    leave-to-class="opacity-0"
                    enter-active-class="transition ease-in-out duration-1000"
                    leave-active-class="transition ease-in-out duration-1000"
                    >
                    <div 
                        class=""
                        v-show="index === currentSliderIndex" >
                        <img 
                            :src="image.url" 
                            :alt="image.title" 
                            class="absolute w-full h-full object-cover group-hover:opacity-50 duration-500" />
                    </div>
                </transition>
            </template>
        </div>                    
        <div class="">
            <h3 class="mt-4 text-2xl font-medium">{{ project.title }}</h3>
            <p class="mt-3 mb-12">{{ project.description }}</p>
        </div>
    </a>`
}