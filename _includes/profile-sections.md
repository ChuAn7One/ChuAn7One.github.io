## Education

{% for degree in site.data.profile.education -%}
- **{{ degree.university }}** · {{ degree.years }}<br>
  {{ degree.school }} · {{ degree.program }}
{% endfor %}
## Competition Experience

{% for award in site.data.profile.awards -%}
- **{{ award.year }} {{ award.competition }}** · {{ award.prize }}
{% endfor %}
## RoboMaster Projects

{% for project in site.portfolio -%}
- [**{{ project.title }}**]({{ project.url | relative_url }}) · {{ project.excerpt }}
{% endfor %}
