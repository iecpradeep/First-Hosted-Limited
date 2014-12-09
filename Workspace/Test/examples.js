//Column U
function replace(sourceContent,column)
{
	var columnVal = 0;
	var cell = '';
	
	columnVal = String.charCodeAt('column');
	
	for(int x=8;x<=47;x++)
	{
		cell = column + x;  
		sourceContent = replaceAll(sourceContent, '##' + cell + '##', data[columnVal,x]);
	}
	
	sourceContent = replaceAll(sourceContent, '##U8##', U8);
	sourceContent = replaceAll(sourceContent, '##U9##', U9);
	sourceContent = replaceAll(sourceContent, '##U10##', U10);
	sourceContent = replaceAll(sourceContent, '##U11##', U11);
	sourceContent = replaceAll(sourceContent, '##U12##', U12);
	sourceContent = replaceAll(sourceContent, '##U13##', U13);
	sourceContent = replaceAll(sourceContent, '##U14##', U14);
	sourceContent = replaceAll(sourceContent, '##U15##', U15);
	sourceContent = replaceAll(sourceContent, '##U16##', U16 );
	sourceContent = replaceAll(sourceContent, '##U17##', U17);
	sourceContent = replaceAll(sourceContent, '##U18##', U18);
	sourceContent = replaceAll(sourceContent, '##U19##', U19);
	sourceContent = replaceAll(sourceContent, '##U20##', U20);
	sourceContent = replaceAll(sourceContent, '##U21##', U21);
	sourceContent = replaceAll(sourceContent, '##U22##', U22);
	sourceContent = replaceAll(sourceContent, '##U23##', U23);
	sourceContent = replaceAll(sourceContent, '##U24##', U24);
	sourceContent = replaceAll(sourceContent, '##U25##', U25);
	sourceContent = replaceAll(sourceContent, '##U26##', U26);
	sourceContent = replaceAll(sourceContent, '##U27##', U27);
	sourceContent = replaceAll(sourceContent, '##U28##', U28);
	sourceContent = replaceAll(sourceContent, '##U29##', U29);
	sourceContent = replaceAll(sourceContent, '##U30##', U30);
	sourceContent = replaceAll(sourceContent, '##U31##', U31);
	sourceContent = replaceAll(sourceContent, '##U32##', U32);
	sourceContent = replaceAll(sourceContent, '##U34##', U34);
	sourceContent = replaceAll(sourceContent, '##U35##', U35);
	sourceContent = replaceAll(sourceContent, '##U36##', U36);
	sourceContent = replaceAll(sourceContent, '##U37##', U37);
	sourceContent = replaceAll(sourceContent, '##U38##', U38);
	sourceContent = replaceAll(sourceContent, '##U39##', U39);
	sourceContent = replaceAll(sourceContent, '##U40##', U40);
	sourceContent = replaceAll(sourceContent, '##U41##', U41);
	sourceContent = replaceAll(sourceContent, '##U42##', U42);
	sourceContent = replaceAll(sourceContent, '##U43##', U43);
	sourceContent = replaceAll(sourceContent, '##U44##', U44);
	sourceContent = replaceAll(sourceContent, '##U46##', U46);
	sourceContent = replaceAll(sourceContent, '##U47##', U47);

	return sourceContent;

}
