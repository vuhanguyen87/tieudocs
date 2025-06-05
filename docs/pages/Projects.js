import { ref, computed, inject } from 'vue'
import { ProjectCard } from '../components/ProjectCard.js'
import { ProjectCatsNav } from '../components/ProjectCatsNav.js'


export const Projects = {
    components: {
        'project-card': ProjectCard,
        'project-cats-nav': ProjectCatsNav
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
            return projects.value.length > 0 ? projects.value[0].category : null
        })

        const firstProjectCat = computed(() => {
            return allCategories.value[0]
        })

        return { projects, selectedCatTitle, allCategories, firstProjectCat }
    },
    template: `
    <section>
        <project-cats-nav 
            :all-categories="allCategories" 
            :selected-cat-title="selectedCatTitle" />
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