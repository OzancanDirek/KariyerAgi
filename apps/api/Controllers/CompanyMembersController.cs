using CareerPath.Api.Dtos.Recruitment;
using CareerPath.Api.Services.CompanyMembership;
using Microsoft.AspNetCore.Mvc;

namespace CareerPath.Api.Controllers;

[ApiController]
[Route("api/company-members")]
public class CompanyMembersController : ControllerBase
{
    private readonly ICompanyMembershipService memberships;

    public CompanyMembersController(ICompanyMembershipService memberships)
    {
        this.memberships = memberships;
    }

    [HttpGet("mine")]
    public async Task<ActionResult<List<CompanyMembershipResponse>>> Mine()
    {
        return await memberships.GetMyMembershipsAsync();
    }

    [HttpGet("company/{companyId:guid}")]
    public async Task<ActionResult<List<CompanyMembershipResponse>>> Company(Guid companyId)
    {
        return await memberships.GetCompanyMembersAsync(companyId);
    }

    [HttpPost("company/{companyId:guid}/invite")]
    public async Task<IActionResult> Invite(Guid companyId, InviteCompanyMemberRequest request)
    {
        await memberships.InviteAsync(companyId, request);
        return NoContent();
    }

    [HttpPost("{membershipId:guid}/accept")]
    public async Task<IActionResult> Accept(Guid membershipId)
    {
        await memberships.AcceptAsync(membershipId);
        return NoContent();
    }

    [HttpPost("{membershipId:guid}/decline")]
    public async Task<IActionResult> Decline(Guid membershipId)
    {
        await memberships.DeclineAsync(membershipId);
        return NoContent();
    }

    [HttpDelete("company/{companyId:guid}/{membershipId:guid}")]
    public async Task<IActionResult> Remove(Guid companyId, Guid membershipId)
    {
        await memberships.RemoveAsync(companyId, membershipId);
        return NoContent();
    }
}
