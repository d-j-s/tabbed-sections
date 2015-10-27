import template from 'lodash.template';

export default template(`
  <ul class="Tabs">
    <% tabs.forEach(function (tab) { %>
      <li class="Tabs-item Tabs-item--<%- tab.key %><% if (tab.selected) { %> Tabs-item--selected<% } %>" role="presentation">
        <a class="Tabs-itemLink" href="" role="tab" aria-controls="<%- tab.panelId %>" aria-selected="<%- tab.selected %>"><%- tab.section %></a>
      </li>
    <% }); %>
  </ul>
`);
