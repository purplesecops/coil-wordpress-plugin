<script type="text/template" id="tmpl-coil-button-message">
	<div class="coil-button">
		<# if ( data.headerLogo ) { #>
				{{{data.headerLogo}}}
			<# } #>
		<# if ( data.button.href ) { #>
			<a target="_blank" href="{{data.button.href}}">{{data.button.text}}</a>
		<# } #>
		<span class="coil-button-dismiss" id="js-coil-button-dismiss">&times;</span>
	</div>
</script>
