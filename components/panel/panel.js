import template from 'lodash.template';

export default template(`
  <ol class="Panel-list Panel-list--<%- id %>">
    <% items.forEach(function (item) { %>
      <li class="Panel-item">
        <a class="Panel-itemLink" href="<%= item.webUrl %>">
          <h3 class="Panel-webTitle"><%- item.webTitle %></h3>
          <% if (item.fields) { %><div class="Panel-trailText"><%= item.fields.trailText %></div><% } %>
        </a>
      </li>
    <% }); %>
  </ol>
`);
