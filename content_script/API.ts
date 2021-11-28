import type { load } from './main'
type response = {
    similar:load[]
    exact:load[]
}
export class API{
    getSearchId = () =>{
        let searchId = ''
        let className = 'currentSearch'
        let searchHeader = document.getElementsByClassName(className)[0]
        if(searchHeader && searchHeader.id)
            searchId = searchHeader.id
        else{ 
            console.error(`Warning Unable To Find Search Header With Class '${className}'`)
        }
        return searchId
    }

    makeApiCall = async (url:string):Promise<any> =>{
        let response:any = await fetch(url, {
            "headers": {
                "x-requested-with": "XMLHttpRequest"
            },
            "body": null,
            "method": "GET",
            "credentials": "include"
        });
        response = await response.json();
        return response
    }

    getLoadInfo = async (matchId:number,defaultInfo:load) =>{
        const searchId = this.getSearchId();

        const checkReponseObject = (responseObj:any) =>{
            Object.keys(defaultInfo).forEach(key =>{
                if(!responseObj[key])
                    responseObj[key] = ''
            })
        }

        let url = `https://power.dat.com/search/matches/take/?matchId=${matchId}&searchId=${searchId}`
        let response:load = await this.makeApiCall(url)
        checkReponseObject(response)
        return response
    }

    getAllLoads = async () =>{
        const searchId = this.getSearchId()
        let allLoads:load[] = []
        const concatLoads = (responseObj:response) =>{
            if(responseObj.exact && responseObj.exact.length > 0)
                allLoads = allLoads.concat(responseObj.exact)
            if(responseObj.similar && responseObj.similar.length > 0)
                allLoads = allLoads.concat(responseObj.similar)
        }

        let urls = [
            `https://power.dat.com/search/matches/sort/?direction=desc&field=Rate&searchId=${searchId}&updateSortParams=true`,
            `https://power.dat.com/search/matches/next/${searchId}?pageSize=1000`
        ]


        console.log('Started API Call')
        let responseObj = await this.makeApiCall(urls[0])
        concatLoads(responseObj)

        responseObj = await this.makeApiCall(urls[1])
        concatLoads(responseObj)
        console.log('Ended API Call')

        return allLoads

    }

}

export default API;