import { ref, computed } from 'vue'
import { ProjectCard } from '../components/ProjectCard.js'

export const Projects = {
    components: {
        'project-card': ProjectCard
    },
    props: { data: { default: {
        projects: [],
        category: ""
    } } },
    setup(props){
        // Use computed to maintain reactivity
        const projects = computed(() => props.data.projects)
        const selectedCategory = computed(() => props.data.category)
        const categories = {
            'documentary': 'Documentary',
            'product-videos': 'Product Videos',
            'after-movie': 'After Movie',
            'corporate-videos': 'Corporate Videos',
            'others': 'Others',
        }

        return { projects, selectedCategory, categories }
    },
    template: `
    <section>
        <ul class="flex justify-center space-x-4">
            <template v-for="category, index in categories" :key="index">
                <li v-if="index == 'documentary'">
                    <a 
                        class="py-2"
                        :class="{ 'font-bold': selectedCategory == 'documentary' }"
                        href="#/"
                        >{{ category }}</a>
                </li>
                <li v-else class="before:content-['•']">
                    <a 
                        class="py-2 pl-3" 
                        :href="'#/projects/' + index"
                        :class="{ 'font-bold': selectedCategory == index }"
                        >{{ category }}</a>
                </li>
            </template>
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