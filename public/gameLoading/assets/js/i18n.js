let lang = localStorage.getItem('sysLang') == null ? 'zh-TW' : localStorage.getItem('sysLang');
$.i18n.load(['./assets/lang/' + lang + '.js'], function (success) {
  if (success) {
    $.i18n.setLocale(lang);
    $('h1[k-resid]').each(function (i, item) {
      $(item).text($.i18n.prop(item));
    });
    $('h2[k-resid]').each(function (i, item) {
      $(item).text($.i18n.prop(item));
    });
    $('button[k-resid]').each(function (i, item) {
      $(item).text($.i18n.prop(item));
    });
    $('div[k-resid]').each(function (i, item) {
      $(item).text($.i18n.prop(item));
    });
    $('p[k-resid]').each(function (i, item) {
      $(item).text($.i18n.prop(item));
    });
    $('span[k-resid]').each(function (i, item) {
      $(item).text($.i18n.prop(item));
    });
  }
});
