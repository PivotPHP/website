# Jekyll plugin to help with i18n - DISABLED temporarily
# module Jekyll
#   class I18nPageGenerator < Generator
#     safe true
#     priority :low
#
#     def generate(site)
#       # For each language except default
#       site.config['languages'].each do |lang|
#         next if lang == site.config['default_lang']
#         
#         # Create language-specific pages
#         site.pages.each do |page|
#           # Skip if already a language-specific page
#           next if page.url.include?("/#{lang}/")
#           
#           # Skip assets and special pages
#           next if page.url.start_with?('/assets/', '/404')
#           
#           # Create new page for this language
#           lang_page = PageWithoutAFile.new(site, site.source, page.dir, page.name)
#           lang_page.data = page.data.dup
#           lang_page.data['lang'] = lang
#           lang_page.data['permalink'] = "/#{lang}#{page.url}"
#           
#           site.pages << lang_page
#         end
#       end
#     end
#   end
# end