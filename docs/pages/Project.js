import { computed } from 'vue'

export const Project = {
    props: { data: { default: null }},
    setup(props){
        const project = computed(() => props.data)
        const ytEmbedUrl = computed(() => 'https://www.youtube.com/embed/' + project.value.video.split('/').slice(-1)[0])
        const parsedDescription = computed(() => project.value.description.replace('\n', '<br>'))
        return { project, ytEmbedUrl, parsedDescription }
    },
    template: `
    <section>
        <h1 class="text-2xl text-center">{{ project.title }}</h1>
        <p class="text-center" v-html="parsedDescription"></p>
        <div class="mt-8 relative w-full" style="padding-bottom: 56.25%;">
            <iframe 
                class="absolute top-0 left-0 w-full h-full"
                :src="ytEmbedUrl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>
        <div class="mt-4 md:mt-8 mx-4 md:mx-0 flex space-x-6">
            <div v-for="image of project.images" class="">
                <img :src="image.url" class="w-[180px] aspect-square object-cover border-2 border-white" />
            </div>
        </div>
    </section>`
}