const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];

function bindConfigLinks(yml) {
    const optionalLinks = [
        ['sidebar-email-link', yml['sidebar-email-link']],
        ['sidebar-scholar-link', yml['sidebar-scholar-link']],
        ['sidebar-orcid-link', yml['sidebar-orcid-link']],
        ['sidebar-rg-link', yml['sidebar-rg-link']]
    ];

    optionalLinks.forEach(([id, href]) => {
        const element = document.getElementById(id);
        if (!element) {
            return;
        }
        if (href) {
            element.href = href;
        } else {
            element.removeAttribute('href');
            element.classList.add('is-placeholder');
        }
    });
}

function enhanceDetailsAnimations(root = document) {
    const detailsElements = root.querySelectorAll('details');
    detailsElements.forEach((details) => {
        if (details.dataset.enhanced === 'true') {
            return;
        }
        details.dataset.enhanced = 'true';

        const body = details.querySelector('.details-body');
        if (!body) {
            return;
        }

        if (details.hasAttribute('open')) {
            details.classList.add('is-open');
        }

        details.addEventListener('toggle', () => {
            if (details.open) {
                details.classList.add('is-open');
            } else {
                details.classList.remove('is-open');
            }
        });
    });
}


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
            bindConfigLinks(yml);
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
                enhanceDetailsAnimations(document.getElementById(name + '-md'));
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

}); 
