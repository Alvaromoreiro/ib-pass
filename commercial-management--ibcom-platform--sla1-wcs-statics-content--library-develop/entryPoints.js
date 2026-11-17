const path = require('path');
const fs = require('fs');

const jsDistPath = 'js/';
const cssDistPath = 'css/';
const jsDevPath = './dev/js/inte-modules/';
const pugDevPath = './dev/pug';
 
const jsEntryPoints = {
    [`${jsDistPath}main`]: `${jsDevPath}main.js`,
    [`${jsDistPath}forms`]: `${jsDevPath}forms.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_searcher-complete`]: `${jsDevPath}ibe-modules/independent/ibe_searcher-complete.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_news`]: `${jsDevPath}ibe-modules/independent/ibe_news.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_offices`]: `${jsDevPath}ibe-modules/independent/ibe_offices.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_entertaiment`]: `${jsDevPath}ibe-modules/independent/ibe_entertaiment.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_partners`]: `${jsDevPath}ibe-modules/independent/ibe_partners.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_flight-status`]: `${jsDevPath}ibe-modules/independent/ibe_flight-status.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_ofdt`]: `${jsDevPath}ibe-modules/independent/ibe_ofdt.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_emergency`]: `${jsDevPath}ibe-modules/independent/ibe_emergency.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_ibplustore`]: `${jsDevPath}ibe-modules/independent/ibe_ibplustore.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_eStore`]: `${jsDevPath}ibe-modules/independent/ibe_eStore.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_combine-avios`]: `${jsDevPath}ibe-modules/independent/ibe_combine-avios.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_hotels-cars`]: `${jsDevPath}ibe-modules/independent/ibe_hotels-cars.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_buy-gift-transfer`]: `${jsDevPath}ibe-modules/independent/ibe_buy-gift-transfer.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_wineclubLanding`]: `${jsDevPath}ibe-modules/independent/ibe_wineclubLanding.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_login_salesforce`]: `${jsDevPath}ibe-modules/independent/ib_login_salesforce.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_login_lim`]: `${jsDevPath}ibe-modules/independent/ibe_login_lim.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_helpcenter`]: `${jsDevPath}ibe-modules/independent/ibe_helpcenter.js`,
    [`${jsDistPath}ibe-modules/forms/ibe_newsletters`]: `${jsDevPath}ibe-modules/forms/ibe_newsletters.js`,
    [`${jsDistPath}ibe-modules/forms/ibe_invoice`]: `${jsDevPath}ibe-modules/forms/ibe_invoice.js`,
    [`${jsDistPath}ibe-modules/forms/ibe_best-price`]: `${jsDevPath}ibe-modules/forms/ibe_best-price.js`,
    [`${jsDistPath}ibe-modules/forms/ibe_claims`]: `${jsDevPath}ibe-modules/forms/ibe_claims.js`,
    [`${jsDistPath}ibe-modules/forms/ibe_minors`]: `${jsDevPath}ibe-modules/forms/ibe_minors.js`,
    [`${jsDistPath}ibe-modules/forms/ibe_donations`]: `${jsDevPath}ibe-modules/forms/ibe_donations.js`,
    [`${jsDistPath}ibe-modules/forms/ibe_vouchermanager`]: `${jsDevPath}ibe-modules/forms/ibe_vouchermanager.js`,
    [`${jsDistPath}loadComponents`]: `${jsDevPath}loadComponents.js`,
    [`${jsDistPath}ibe-modules/landings/ibe_CFLanding_T1`]: `${jsDevPath}ibe-modules/landings/ibe_CFLanding_T1.js`,
    [`${jsDistPath}ibe-modules/landings/ibe_CFLanding_Tg_T2_T3`]: `${jsDevPath}ibe-modules/landings/ibe_CFLanding_Tg_T2_T3.js`,
    [`${jsDistPath}ibe-modules/landings/modules/ibe_asyncSeeker`]: `${jsDevPath}ibe-modules/landings/modules/ibe_asyncSeeker.js`,
    [`${jsDistPath}ibe-modules/landings/modules/ibe_grouped-links`]: `${jsDevPath}ibe-modules/landings/modules/ibe_grouped-links.js`,
    [`${jsDistPath}ibe-modules/landings/modules/ibe_seo_modules`]: `${jsDevPath}ibe-modules/landings/modules/ibe_seo_modules.js`,
    [`${jsDistPath}ibe-modules/landings/modules/ibe_weather_module`]: `${jsDevPath}ibe-modules/landings/modules/ibe_weather_module.js`,
    [`${jsDistPath}ibe-modules/landings/modules/ibe_standardOfLiving`]: `${jsDevPath}ibe-modules/landings/modules/ibe_standardOfLiving.js`,
    [`${jsDistPath}ibe-modules/landings/modules/ibe_prices_chart_module`]: `${jsDevPath}ibe-modules/landings/modules/ibe_prices_chart_module.js`,
    [`${jsDistPath}ibe-modules/destinationGuide/guideDetail`]: `${jsDevPath}ibe-modules/destinationGuide/guideDetail.js`,
    [`${jsDistPath}ibe-modules/experienceGuide/guideExperience`]: `${jsDevPath}ibe-modules/experienceGuide/guideExperience.js`,
    [`${jsDistPath}ibe-modules/destinationGuide/customGuide`]: `${jsDevPath}ibe-modules/destinationGuide/customGuide.js`,
    [`${jsDistPath}ibe-modules/destinationGuide/lateralSeeker`]: `${jsDevPath}ibe-modules/destinationGuide/lateralSeeker.js`,
    [`${jsDistPath}ibe-modules/destinationGuide/destinationGuide`]: `${jsDevPath}ibe-modules/destinationGuide/destinationGuide.js`,
    [`${jsDistPath}ibe-modules/landings/modules/ibe_highlightedLanding`]: `${jsDevPath}ibe-modules/landings/modules/ibe_highlightedLanding.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_logout_onbusiness`]: `${jsDevPath}ibe-modules/independent/ibe_logout_onbusiness.js`,
    [`${jsDistPath}ibe-modules/landings/ibe_CFLanding_T1Tg_MonthsSeasons`]: `${jsDevPath}ibe-modules/landings/ibe_CFLanding_T1Tg_MonthsSeasons.js`,
    [`${jsDistPath}ibe-modules/stopover/ibe_LandingExperiences`]: `${jsDevPath}ibe-modules/stopover/ibe_LandingExperiences.js`,
    [`${jsDistPath}ibe-modules/simuladorAvios/ibe_simuladorAvios`]: `${jsDevPath}ibe-modules/simuladorAvios/ibe_simuladorAvios.js`,
    [`${jsDistPath}ibe-modules/contenidos/ibe_contenidos`]: `${jsDevPath}ibe-modules/contenidos/ibe_contenidos.js`,
    [`${jsDistPath}ibe-modules/stopover/ibe_StopOverNew`]: `${jsDevPath}ibe-modules/stopover/ibe_StopOverNew.js`,
    [`${jsDistPath}ibe-modules/stopover/ibe_seekerStopOVer`]: `${jsDevPath}ibe-modules/stopover/ibe_seekerStopOVer.js`,
    [`${jsDistPath}ibe-modules/universia/ibe_universia`]: `${jsDevPath}ibe-modules/universia/ibe_universia.js`,
    [`${jsDistPath}ibe-modules/stopover/ibe_plansExperiencies`]: `${jsDevPath}ibe-modules/stopover/ibe_plansExperiencies.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_connections_others`]: `${jsDevPath}ibe-modules/independent/ibe_connections_others.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_connections_madrid`]: `${jsDevPath}ibe-modules/independent/ibe_connections_madrid.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_ibholidays`]: `${jsDevPath}ibe-modules/independent/ibe_ibholidays.js`,
    [`${jsDistPath}ibe-modules/independent/ibe_bobLanding`]: `${jsDevPath}ibe-modules/independent/ibe_bobLanding.js`, // bob
    [`${jsDistPath}ibe-modules/claims/ibe_claims_landings`]: `${jsDevPath}ibe-modules/claims/ibe_claims_landings.js`,
    [`${jsDistPath}ibe-modules/claims/ibe_claims_luggage`]: `${jsDevPath}ibe-modules/claims/ibe_claims_luggage.js`,
    [`${jsDistPath}ibe-modules/claims/ibe_claims_incidents`]: `${jsDevPath}ibe-modules/claims/ibe_claims_incidents.js`,
    [`${jsDistPath}ibe-modules/unmr/ibe_modal-unmr`]: `${jsDevPath}ibe-modules/unmr/ibe_modal-unmr.js`,
    [`${jsDistPath}ibe-modules/claims/ibe_claims_documents`]: `${jsDevPath}ibe-modules/claims/ibe_claims_documents.js`,
    [`${jsDistPath}ibe-modules/claims/ibe_claims_disruptions`]: `${jsDevPath}ibe-modules/claims/ibe_claims_disruptions.js`,
};

const cssEntryPoints = {
    [`${cssDistPath}/critical`]: './dev/scss/critical.scss',
    [`${cssDistPath}/modules`]: './dev/scss/modules.scss',
    [`${cssDistPath}/modulesHome`]: './dev/scss/modulesHome.scss',
};

const legacyEntryPoints = {
    [`${jsDistPath}core`]: './dev/js/inte-legacy-build/core.js',

};

const jqueryuiDependencies = [
    // "./node_modules/components-jqueryui/ui/core.js",
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/version.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widget.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/position.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/data.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/disable-selection.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effect.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-blind.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-bounce.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-clip.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-drop.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-explode.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-fade.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-fold.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-highlight.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-puff.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-pulsate.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-scale.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-shake.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-size.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-slide.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/effects/effect-transfer.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/focusable.js'),
    // path.resolve( __dirname, "./node_modules/components-jqueryui/ui/form.js"),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/form-reset-mixin.js'),
    // path.resolve( __dirname, "./node_modules/components-jqueryui/ui/ie.js"),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/jquery-1-7.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/keycode.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/labels.js'),
    // path.resolve( __dirname, "./node_modules/components-jqueryui/ui/plugin.js"),
    // path.resolve( __dirname, "./node_modules/components-jqueryui/ui/safe-active-element.js"),
    // path.resolve( __dirname, "./node_modules/components-jqueryui/ui/safe-blur.js"),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/scroll-parent.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/tabbable.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/unique-id.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/accordion.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/autocomplete.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/button.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/checkboxradio.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/controlgroup.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/datepicker.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/dialog.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/draggable.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/droppable.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/menu.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/mouse.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/progressbar.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/resizable.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/selectable.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/selectmenu.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/slider.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/sortable.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/spinner.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/ui/widgets/tabs.js'),
    // path.resolve( __dirname,  "./node_modules/components-jqueryui/ui/widgets/tooltip.js),
];

const libDependencies = [
    path.resolve(__dirname, './node_modules/jquery/dist/jquery.js'),
    path.resolve(__dirname, './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'),
    // path.resolve(__dirname, './dev/js/dev/jquery.dependencies.js'),
    path.resolve(__dirname, './node_modules/components-jqueryui/jquery-ui.js'), // ...jqueryuiDependencies
    path.resolve(__dirname, './node_modules/jquery-placeholder/jquery.placeholder.min.js'),
    path.resolve(__dirname, './node_modules/selectize/dist/js/standalone/selectize.js'),
    path.resolve(__dirname, './node_modules/js-cookie/src/js.cookie.js'),
    path.resolve(__dirname, './node_modules/jquery.dotdotdot/src/jquery.dotdotdot.js'),
    path.resolve(__dirname, './node_modules/jquery.ioslist/dist/js/jquery.ioslist.js'),
    path.resolve(__dirname, './node_modules/datatables/media/js/jquery.dataTables.js'),
    path.resolve(__dirname, './node_modules/slick-carousel/slick/slick.js'),
    path.resolve(__dirname, './dev/js/lib/jquery-gi-thewall/jQuery.GI.TheWall.js'),
    path.resolve(__dirname, './node_modules/masonry/dist/masonry.pkgd.js'),
    path.resolve(__dirname, './node_modules/libgif/libgif.js'),
    path.resolve(__dirname, './node_modules/bootstrap-tabdrop/src/js/bootstrap-tabdrop.js'),
    path.resolve(__dirname, './dev/js/lib/theta-carousel/theta-carousel.min.js'),
    // path.resolve(__dirname, "./node_modules/picturefill/dist/picturefill.min.js"),
    path.resolve(__dirname, './node_modules/in-view/dist/in-view.min.js'),
    path.resolve(__dirname, './node_modules/@iberia/ib-core-fonts/dist/fonts/**.*'),
];

const initFile = [
    path.resolve(__dirname, './dev/js/components/**.*'),
    path.resolve(__dirname, './dev/js/components/**/**.*'),
    path.resolve(__dirname, './dev/js/dev/dfront.js'),
];

fs.readdirSync('./dev/js/ibe-components').forEach((val) => {
    const fileName = val.split('.')[0];
    jsEntryPoints[`ibe-components/${fileName}/${fileName}`] = `./dev/js/ibe-components/${val}`;
});

fs.readdirSync('./dev/scss/ibe-components').forEach((val) => {
    const fileName = val.split('.')[0];
    cssEntryPoints[`ibe-components/${fileName}/${fileName}.css`] = {
        import: `./dev/scss/ibe-components/${val}`,
        filename: `ibe-components/${fileName}/${fileName}.css`,
    };
});

const pugEntryPoints = {};

fs.readdirSync(pugDevPath).forEach((val) => {
    const filename = val.split('.')[0];
    if (val.split('.')[1]) {
        pugEntryPoints[filename] = `${pugDevPath}/${val}`;
    }
});

module.exports = {
    jsEntryPoints,
    cssEntryPoints,
    libDependencies,
    legacyEntryPoints,
    pugEntryPoints,
    jqueryuiDependencies,
    initFile,
};
