export interface Collection {
    _id: string,
    name: string,
    slug: string,
    description: string,
    type: "hot" | "topic",
    publish: boolean
}