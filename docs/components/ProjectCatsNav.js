export const ProjectCatsNav = {
    props: {
        allCategories: {
            type: Array,
            required: true
        },
        selectedCatTitle: {
            type: String,
            default: null
        }
    },
    template: `
        <ul class="grid grid-cols-2 md:grid-cols-none md:flex justify-center items-center mx-3">
            <template v-for="(category, index) in allCategories" :key="index">
                <li 
                    class="before:content-['|']"
                    :class="{ 'md:before:content-none': index == 0 }">
                    <a
                        class="p-2 hover:font-bold hover:text-xl"
                        :class="{ 'font-bold md:text-lg': selectedCatTitle == category.title }"
                        :href=" index == 0 ? '#/' : '#/projects/' + category.slug"
                        >{{ category.title }}</a>
                </li>
            </template>
        </ul>
    `
} 