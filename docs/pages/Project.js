export const Project = {
    props: { data: { default: [] }},
    setup(props){
        console.log(props)
        const project = props.data
        return { project }
    },
    template: `
    <section></section>`
}