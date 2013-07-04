// Setup for a single site, use things like apache alias
// to replace this file per installation
var dojoConfig = {
    debug: true,
    async: true,
    locale: 'da',
    keep_locale: true,
    domain_name: 'essens',  // This is the only thing needed to be replaced in a new installation
    service_uri: null,
    parseOnLoad: false,
    sse_events: false,
    auto_login: false,
    packages: [
        {
            name: 'kso',
            location: 'kso'
        }
    ]
};
