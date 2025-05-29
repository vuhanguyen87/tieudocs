import { ref, computed, inject } from 'vue'
import { ProjectCard } from '../components/ProjectCard.js'


export const Projects = {
    components: {
        'project-card': ProjectCard
    },
    props: { data: { default: {
        projects: [],
        allCategories: []
    } } },
    setup(props){
        // Use computed to maintain reactivity
        const projects = computed(() => props.data.projects)
        const allCategories = computed(() => props.data.allCategories)

        const selectedCatTitle = computed(() => {
            return projects.length > 0 ? projects[0].category : null
        })

        return { projects, selectedCatTitle, allCategories }
    },
    template: `
    <section>
        <ul class="grid grid-cols-2 md:grid-cols-none md:flex justify-center mx-3 md:space-x-4">
            <template v-for="category in allCategories" :key="category.slug">
                <li v-if="category.slug == 'documentary'"
                    class="before:content-['|'] md:before:content-none">
                    <a
                        class="py-2 hover:font-bold"
                        :class="{ 'font-bold': selectedCatTitle == category.title }"
                        href="#/"
                        >{{ category.title }}</a>
                </li>
                <li v-else class="before:content-['|']">
                    <a 
                        class="py-2 md:pl-3 hover:font-bold" 
                        :href="'#/projects/' + category.slug"
                        :class="{ 'font-bold': selectedCatTitle == category.title }"
                        >{{ category.title }}</a>
                </li>
            </template>
        </ul>
        <div class="mt-8 grid md:grid-cols-4 space-y-4">
            <div
                :key="index"
                class="md:col-start-2 md:col-span-2" 
                v-for="project, index in projects">
                <project-card 
                    :project="project" />
            </div>
        </div>
    </section>`
}