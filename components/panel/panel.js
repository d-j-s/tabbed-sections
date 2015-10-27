import template from 'lodash.template';

export default template(`
  <div role="tabpanel" aria-labelledby="<%= panelId %>">
    <ul>
      <% items.forEach(function (item) { %>
        <li>
          <a href="<%= item.webUrl %>"><%= item.webTitle %><% if (item.fields) { %>, <%- item.fields.trailText %><% } %></a>
        </li>
      <% }); %>
    </ul>
  </div>
`);

