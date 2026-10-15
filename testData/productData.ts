export const productData = {
    // Real products available in the Sauce Demo store
    products: {
        greyJacket: {
            handle: "grey-jacket",
            name: "Grey jacket",
            price: "£55.00",
            available: true,
        },
        bronzeSandals: {
            handle: "bronze-sandals",
            name: "Bronze sandals",
            price: "£39.99",
            available: true,
        },
        stripedTop: {
            handle: "striped-top",
            name: "Striped top",
            price: "£50.00",
            available: true,
        },
        brownShades: {
            handle: "brown-shades",
            name: "Brown Shades",
            price: "£20.00",
            available: false, // SOLD OUT
        },
    },

    // Search terms mapped to expected behavior
    searchTerms: {
        returnsResults: "jacket",
        returnsResultsAlt: "sandals",
        noResults: "xyzabc123noitem",
        emptyQuery: "",
    },
};
