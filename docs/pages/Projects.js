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
            return projects.value.length > 0 ? projects.value[0].category : null
        })

        const firstProjectCat = computed(() => {
            return allCategories.value[0]
        })

        return { projects, selectedCatTitle, allCategories, firstProjectCat }
    },
    template: `
    <section>
        <ul class="grid grid-cols-2 md:grid-cols-none md:flex justify-center mx-3 md:space-x-4">
            <template v-for="(category, index) in allCategories" :key="index">
                <li 
                    class="before:content-['|']"
                    :class="{ 'md:before:content-none': index == 0 }">
                    <a
                        class="py-2 hover:font-bold"
                        :class="{ 'font-bold md:text-lg': selectedCatTitle == category.title }"
                        :href=" index == 0 ? '#/' : '#/projects/' + category.slug"
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