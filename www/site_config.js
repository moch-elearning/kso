// Setup for a single site, use things like apache alias
// to replace this file per installation
var dojoConfig = {
    debug: false,
    async: true,
    locale: 'da',
    keep_locale: true,
    domain_name: 'essens',  // This is the only thing needed to be replaced in a new installation
    service_uri: 'https://phoenix.moch.dk/service',
    parseOnLoad: false,
    sse_events: true,
    packages: [
        {
            name: 'kso',
            location: 'kso'
        }
    ]
};
