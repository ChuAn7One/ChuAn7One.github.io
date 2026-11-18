## Education

{% for degree in site.data.profile.education -%}
- **{{ degree.university }}** · {{ degree.years }}<br>
  {{ degree.school }} · {{ degree.program }}
{% endfor %}
## RoboMaster Awards

{% for award in site.data.profile.awards -%}
- **{{ award.year }} RoboMaster** · {{ award.prize }}
{% endfor %}
## RoboMaster Projects

{% for project in site.portfolio -%}
- [**{{ project.title }}**]({{ project.url | relative_url }}) · {{ project.excerpt }}
{% endfor %}
