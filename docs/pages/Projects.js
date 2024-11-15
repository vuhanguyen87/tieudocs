import { ref, computed } from 'vue'
import { ProjectCard } from '../components/ProjectCard.js'

export const Projects = {
    components: {
        'project-card': ProjectCard
    },
    props: { data: { default: null }},
    setup(props){
        // Use computed to maintain reactivity
        const projects = computed(() => props.data)
        
        return { projects }
    },
    template: `
    <section>
        <ul class="flex justify-center space-x-4">
            <li><a class="py-2" href="#/">Documentary</a></li>
            <li class="before:content-['•']"><a class="py-2 pl-3" href="#/projects/after-movie">After Movie</a></li>
            <li class="before:content-['•']"><a class="py-2 pl-3" href="#/projects/corporate-videos">Corporate Videos</a></li>
            <li class="before:content-['•']"><a class="py-2 pl-3" href="#/projects/others">Others</a></li>
        </ul>
        <div class="mt-8 grid md:grid-cols-3 space-y-4">
            <div
                :key="index"
                class="md:col-start-2" 
                v-for="project, index in projects">
                <project-card 
                    :project="project" />
            </div>
        </div>
    </section>`
}