/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Filter:{
		name:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		},
		version:{
			type:"String",
			array:false,
			arrayRequired:false,
			required:true
		}
	},
	Query:{
		bundle:{
			filter:{
				type:"Filter",
				array:false,
				arrayRequired:false,
				required:true
			}
		}
	}
}

export const ReturnTypes: Record<string,any> = {
	Bundle:{
		jsonUrl:"String",
		name:"String",
		version:"String"
	},
	Query:{
		bundle:"Bundle"
	}
}