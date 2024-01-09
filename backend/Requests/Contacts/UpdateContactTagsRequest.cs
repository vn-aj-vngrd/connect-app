using System.ComponentModel.DataAnnotations;
using ConnectApi.Entities;

namespace ConnectApi.Requests;

public class UpdateContactTagsRequest
{
    public long[] TagIds { get; set; } = [];
}
