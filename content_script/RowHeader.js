import API from './API'
const api = new API()

const checkReponseObject = (defaultInfo,responseObj) =>{
    Object.keys(defaultInfo).forEach(key =>{
        if(!responseObj[key])
            responseObj[key] = ''
    })
}

export const getRowHTML = async(load,hide) =>{
    let hideClass = (hide)?' ng-hide':''

    let defaultInfo = {
        commodity: "",
        comment1: "",
        comment2: "",
        docketNumber: "",
        dockHours: "",
        pickupHours: "",
        referenceId:""
    }

    if(!hide)
        defaultInfo = await api.getLoadInfo(load.id,defaultInfo)

    const mainRow = 
    `
    <tr id="${load.id}" class="qa-match-row resultSummary unread">
        <td class="activity" rowspan="4"> <!-- rowspan is for groups formatting when expanded -->
            <!-- rowspan is for groups formatting when expanded -->
            <mark></mark>
        </td>
        <td class="new">&nbsp;</td> <!-- Please leave the nbsp, they are necessary for table row strikeout to work right in IE -->
        
        <td class="select">
            <input type="checkbox" class="customCheckbox searchBatch" id="${load.id}-check">
            <label for="${load.id}-check"></label>
            &nbsp;
        </td>

        <td class="age ">${load.age}</td>

        <td class="avail ">${load.presentationDate}</td>

        <td class="truck ">${load.equipmentClass}</td>

        <td class="fp ">${load.isPartial}</td>

        <td class="do ">0</td>

        <td class="origin">${load.origin}</td>

        <td class="trip">
            <a  
                href="urls?Category=Routing&amp;MatchId=LS49dmtj&amp;RegistryId=S.117764.241114&amp;CategoryProvider=ProMiles" 
                class="trackLink" 
                track-link-category="Trip Miles" 
                target="_blank">
                    ${load.tripMiles}
            </a>
        </td>

        <td class="dest ">${load.destination}</td>

        <td class="dd ">${load.deadheadMilesDestination}</td>

        <td class="company dropdown ">
             <a data-toggle="dropdown" 
                class="trackLink companyToggle" 
                title="${load.company} (click for details)">
                    ${load.company}
            </a>
        </td>

        <td class="contact">${load.contactPhone}</td>

        <td class="length ">${load.length}</td>

        <td class="weight ">${load.weight}</td>

        <td class="cs">
            <a  href="urls?Category=CustomerDirectoryCreditProfile&amp;MatchId=LS49dmtj&amp;RegistryId=S.117764.241114" 
                class="trackLink" 
                track-link-category="Credit Score" 
                target="_blank">
                    ${load.creditScore}
            </a>
        </td>

        <td class="dtp">
            <a  href="urls?Category=CustomerDirectoryCreditProfile&amp;MatchId=LS49dmtj&amp;RegistryId=S.117764.241114" 
                class="trackLink" 
                track-link-category="Credit Score" 
                target="_blank">
                    22
            </a>
        </td>

        <td class="factorable" title="Factor It">
            <a  href="urls?Category=Factoring&amp;MatchId=LS49dmtj&amp;RegistryId=S.117764.241114&amp;CategoryProvider=abc" 
                class="trackLink" 
                track-link-category="Factoring" 
                target="_blank">
            </a>
        </td>

        <td class="rate">${load.rate}</td>


        <td class="rate">$${load.PPM}</td>
    </tr>
    `

    const rowInfo = 
    `
    <tr class="groupData ng-scope ${hideClass}">
        <td colspan="20">
            <!-- colspan not the same as summary row due to rowspan in groups -->
            <a class="menuToggle "></a>
            <mark class="workInitials "></mark>
            <mark class="status "></mark>
            <p class="notesLabel ">
                <span class="label">Notes:</span> 
                <span class="note"></span>
            </p>
            
            <aside>
            <fieldset class="workstatus">
                <input type="radio" name="${load.id}-status" value="1" id="${load.id}-1">
                <label for="${load.id}-1">Accepted</label>
                <input type="radio" name="${load.id}-status" value="2" id="${load.id}-2">
                <label for="${load.id}-2">Called</label>
                <input type="radio" name="${load.id}-status" value="3" id="${load.id}-3">
                <label for="${load.id}-3">No Longer Available</label>
                <input type="radio" name="${load.id}-status" value="4" id="${load.id}-4">
                <label for="${load.id}-4">Refused</label>
                <input type="radio" name="${load.id}-status" value="5" id="${load.id}-5">
                <label for="${load.id}-5">Unqualified</label>
                <a class="removeStatusNotes ng-hide">Remove status and notes</a>
            </fieldset>
            <fieldset class="notes">
                <textarea placeholder="Pick a status" class="note" maxlength="256" disabled=""></textarea>
                <button class="cancelworkstatus" type="button"></button>
                <button class="setworkstatus" type="button" disabled="">Submit</button>
            </fieldset>
            </aside>
        </td>
    </tr>

    <tr class="resultDetails  ng-scope ${hideClass}">
        <td colspan="20">
            <!---->
            <!-- colspan not the same as summary row due to rowspan in groups -->
            <dl>
                <dt>Ref:</dt>
                <dd class="refId">${defaultInfo.referenceId}</dd>
                <dt>Commodity:</dt>
                <dd class="commodity" title="${defaultInfo.commodity}">${defaultInfo.commodity}</dd>
            </dl>
            <dl>
                <dt>Comments 1:</dt>
                <dd class="comments1" title="${defaultInfo.comment1}">${defaultInfo.comment1}</dd>
                <dt>Comments 2:</dt>
                <dd class="comments2" title="${defaultInfo.comment2}">${defaultInfo.comment2}</dd>
            </dl>
            <dl>
                <dt class="">Docket:</dt>
                <dd class="docket ">
                    <a href="urls?Category=CustomerDirectoryTCSIProfile&amp;MatchId=DS2byLDs&amp;RegistryId=S.157791.283877" 
                        class="trackLink" track-link-category="Company" target="_blank"
                        >
                            ${defaultInfo.docketNumber}
                    </a>
                </dd>

                <dd class="bonding">
                    <span class="is-tia-member" title="TIA Member"></span>    
                    <span class="is-assurable" title="Assure It">
                        <a href="${defaultInfo.TIAURL}" 
                            class="trackLink" 
                            track-link-category="Assurable" 
                            target="_blank"
                            >
                        </a>
                    </span>
                </dd>
            </dl>
        </td>
    </tr>

    <tr class="actions ng-scope ${hideClass}">
        <td colspan="20">
            <a class="print" title="Print"></a>
        </td>
    </tr>
    `
    return mainRow + rowInfo 
}
export default getRowHTML;
