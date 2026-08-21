const fs = require('fs');
const file = '/home/obregan/Documents/nodl/nodld/internal/api/server.go';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('"/affiliates/invite"')) {
    content = content.replace(
        'apiV1.Get("/affiliates", s.requireAccess(account.RoleStandard, "nodlr", "command"), s.handleGetAffiliatesSummary)',
        'apiV1.Get("/affiliates", s.requireAccess(account.RoleStandard, "nodlr", "command"), s.handleGetAffiliatesSummary)\n\tapiV1.Get("/affiliates/invite", s.requireAccess(account.RoleStandard, "nodlr", "command"), s.handleGetAffiliateInvite)'
    );

    content += `\nfunc (s *Server) handleGetAffiliateInvite(c *fiber.Ctx) error {
\tuserWUID := c.Query("user")
\tif userWUID == "" {
\t\tuserWUID = c.Locals("user_id").(string)
\t}
\t// The canonical invite code is the user's WUID
\treturn c.JSON(fiber.Map{"code": userWUID})
}\n`;

    fs.writeFileSync(file, content);
    console.log("Patched server.go");
} else {
    console.log("Already patched");
}
